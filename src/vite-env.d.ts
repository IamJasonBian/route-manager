/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_MODE?: 'netlify' | 'mock' | 'remote';
  /** Same-origin path (default `/.netlify/functions`) or full URL for remote mocks */
  readonly VITE_API_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  /** When `VITE_API_MODE=remote`, full base including path prefix to functions */
  readonly VITE_REMOTE_API_BASE?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
  /** Skip Postgres-backed getRoutes and use seeded routes (fast UI/dev) */
  readonly VITE_USE_MOCK_ROUTES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
