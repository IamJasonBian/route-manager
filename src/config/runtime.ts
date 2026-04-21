/**
 * Client-side API runtime: Netlify functions (default), in-memory mock, or remote mock/staging URL.
 * Aligns with netlify.toml [dev.environment] VITE_API_URL.
 */

export type ApiMode = 'netlify' | 'mock' | 'remote';

export function getApiMode(): ApiMode {
  const m = import.meta.env.VITE_API_MODE;
  if (m === 'mock' || m === 'remote') return m;
  return 'netlify';
}

/** Axios baseURL: relative path for same-origin, or absolute URL for remote mocks */
export function getApiBaseUrl(): string {
  if (getApiMode() === 'remote') {
    const remote = import.meta.env.VITE_REMOTE_API_BASE?.trim();
    if (remote) return remote.replace(/\/$/, '');
  }
  const fromEnv =
    import.meta.env.VITE_API_URL?.trim() ||
    import.meta.env.VITE_API_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return '/.netlify/functions';
}

export function getApiTimeoutMs(): number {
  const n = Number(import.meta.env.VITE_API_TIMEOUT_MS);
  return Number.isFinite(n) && n > 0 ? n : 20_000;
}

/** When true, skip Postgres-backed getRoutes and use seeded routes (fast UI / tests). */
export function mockRoutesFromEnv(): boolean {
  return import.meta.env.VITE_USE_MOCK_ROUTES === 'true';
}
