#!/usr/bin/env tsx
// Hits /api-health on a target host and exits non-zero if any check fails
// (or if the canonical query returns 0 offers).
//
// Usage:
//   npm run check:health                 # localhost:8888 (netlify dev)
//   npm run check:health -- --prod       # alias for prod URL below
//   npm run check:health -- --url=https://route-manager-alpha.netlify.app
//   npm run check:health -- --deep       # also probes every monitored route

const PROD_URL  = 'https://route-manager-prod.netlify.app';
const ALPHA_URL = 'https://route-manager-alpha.netlify.app';
const LOCAL_URL = 'http://localhost:8888';

interface Check {
  id: string;
  status: 'pass' | 'warn' | 'fail';
  ms?: number;
  offers?: number;
  samplePrice?: number;
  message?: string;
  [k: string]: unknown;
}

interface Body {
  status: 'pass' | 'warn' | 'fail';
  checks: Check[];
  summary: { total: number; passed: number; warned: number; failed: number };
  ranAt: string;
  elapsed_ms: number;
  deep: boolean;
}

function parseArgs(argv: string[]): { url: string; deep: boolean; route?: string } {
  let url = LOCAL_URL;
  let deep = false;
  let route: string | undefined;
  for (const arg of argv) {
    if (arg === '--prod') url = PROD_URL;
    else if (arg === '--alpha') url = ALPHA_URL;
    else if (arg === '--deep') deep = true;
    else if (arg.startsWith('--url=')) url = arg.slice('--url='.length);
    else if (arg.startsWith('--route=')) route = arg.slice('--route='.length);
  }
  return { url, deep, route };
}

const COLORS = {
  reset: '\x1b[0m', dim: '\x1b[2m',
  green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m',
};

function color(status: Check['status']): string {
  if (status === 'pass') return COLORS.green;
  if (status === 'warn') return COLORS.yellow;
  return COLORS.red;
}

function symbol(status: Check['status']): string {
  if (status === 'pass') return '✓';
  if (status === 'warn') return '!';
  return '✗';
}

async function main() {
  const { url, deep, route } = parseArgs(process.argv.slice(2));
  const qs = new URLSearchParams();
  if (deep) qs.set('deep', '1');
  if (route) qs.set('route', route);
  const target = `${url}/.netlify/functions/api-health${qs.toString() ? `?${qs}` : ''}`;

  console.log(`${COLORS.cyan}→ GET ${target}${COLORS.reset}`);

  const t0 = Date.now();
  let res: Response;
  try {
    res = await fetch(target);
  } catch (e: any) {
    console.error(`${COLORS.red}✗ network error: ${e.message}${COLORS.reset}`);
    process.exit(2);
  }
  const ms = Date.now() - t0;

  let body: Body;
  try {
    body = await res.json() as Body;
  } catch {
    console.error(`${COLORS.red}✗ non-JSON response (HTTP ${res.status})${COLORS.reset}`);
    process.exit(2);
  }

  console.log(`${COLORS.dim}HTTP ${res.status} in ${ms}ms${COLORS.reset}\n`);

  for (const c of body.checks) {
    const head = `${color(c.status)}${symbol(c.status)} ${c.id}${COLORS.reset}`;
    const tail: string[] = [];
    if (c.ms !== undefined) tail.push(`${c.ms}ms`);
    if (c.offers !== undefined) tail.push(`${c.offers} offer${c.offers === 1 ? '' : 's'}`);
    if (c.samplePrice !== undefined) tail.push(`$${c.samplePrice}`);
    if (c.message) tail.push(c.message);
    console.log(`  ${head}${tail.length ? `  ${COLORS.dim}${tail.join(' · ')}${COLORS.reset}` : ''}`);
  }

  const s = body.summary;
  const top = body.status === 'pass' ? COLORS.green
            : body.status === 'warn' ? COLORS.yellow
            : COLORS.red;
  console.log(
    `\n${top}${body.status.toUpperCase()}${COLORS.reset}  ` +
    `${s.passed} passed, ${s.warned} warned, ${s.failed} failed (${body.elapsed_ms}ms)`
  );

  process.exit(body.status === 'fail' ? 1 : 0);
}

main().catch(e => {
  console.error(`unexpected error: ${e?.message || e}`);
  process.exit(2);
});
