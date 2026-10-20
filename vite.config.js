import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: nom du repo GitHub → nécessaire pour GitHub Pages
export default defineConfig({
  base: '/TestVibeFormation/',
  plugins: [react()],
});