import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p: string) => resolve(__dirname, p);

export default defineConfig({
  base: '/cassino-arcano/',
  resolve: {
    alias: {
      $lib: r('src/lib'),
      $components: r('src/lib/components'),
      $pages: r('src/pages'),
      $game: r('src/lib/game'),
      $effects: r('src/lib/effects')
    }
  },
  plugins: [svelte()],
  build: {
    target: 'es2022',
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    strictPort: false
  }
});
