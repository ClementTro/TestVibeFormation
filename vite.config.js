import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// base: nom du repo GitHub → nécessaire pour GitHub Pages
export default defineConfig({
  base: '/TestVibeFormation/',
  plugins: [react()],
  build: {
    rollupOptions: {
      // Site multi-pages :
      // - index.html → la grande vitrine "Les Journées Nationales" (/)
      // - jnr.html   → le clone JNR actuel (/jnr)
      input: {
        main: resolve(__dirname, 'index.html'),
        jnr: resolve(__dirname, 'jnr.html'),
      },
    },
  },
});
