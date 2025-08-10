import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Mock Node.js modules that might be required by dependencies
      'node:buffer': 'buffer',
      'node:stream': 'stream-browserify',
      'node:util': 'util',
      'node:path': 'path-browserify',
    },
  },
  optimizeDeps: {
    exclude: [
      'pg',
      'pg-cloudflare',
      'pg-native',
      'pg-connection-string',
      'pg-pool',
      'pg-protocol',
      'pg-types',
      'pgpass',
    ],
  },
  ssr: {
    noExternal: ['pg'],
    // Ensure these are treated as external in SSR
    external: ['pg-cloudflare', 'cloudflare:sockets'],
  },
  build: {
    rollupOptions: {
      external: [
        'pg-cloudflare',
        'cloudflare:sockets',
        'pg-native',
        'node:buffer',
        'node:stream',
        'node:util',
        'node:path',
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    // Let Netlify Dev handle the proxy
    port: 5173, // Explicitly set the Vite dev server port
    strictPort: true, // Don't try to find another port if 5173 is in use
  },
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`,
    global: 'globalThis',
  },
});
