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
      // - lgsv.html  → La Grande Semaine Végétale (/lgsv)
      // - siat.html  → La Semaine de l'IA pour Tous (/siat)
      // - snps.html  → La Semaine Nationale de la Prévention Santé (/snps)
      input: {
        main: resolve(__dirname, 'index.html'),
        jnr: resolve(__dirname, 'jnr.html'),
        lgsv: resolve(__dirname, 'lgsv.html'),
        siat: resolve(__dirname, 'siat.html'),
        snps: resolve(__dirname, 'snps.html'),
      },
    },
  },
});
