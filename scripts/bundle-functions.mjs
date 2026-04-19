import { build } from 'esbuild';
import { readdirSync } from 'fs';
import { join } from 'path';

const functionsDir = 'netlify/functions';
const outDir = 'netlify/functions-bundled';

const files = readdirSync(functionsDir).filter(f => f.endsWith('.js'));

console.log(`Bundling ${files.length} functions...`);

await build({
  entryPoints: files.map(f => join(functionsDir, f)),
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outdir: outDir,
  external: ['better-sqlite3'],
  logLevel: 'info',
});

console.log(`Bundled to ${outDir}/`);
