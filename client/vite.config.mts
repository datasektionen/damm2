import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep CRA's output folder and port so the server, Dockerfile and dev setup stay unchanged
  build: {
    outDir: 'build',
    // Lightning CSS breaks react-data-grid's light-dark() colors when lowering them
    cssTarget: 'esnext',
  },
  server: {
    port: 3000,
    proxy: Object.fromEntries(
      ['/api', '/login', '/logout', '/oidc', '/fuzzyfile'].map((path) => [
        path,
        'http://localhost:8080',
      ])
    ),
  },
});
