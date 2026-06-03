import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves project sites under /<repo-name>/, so the production
// build needs that prefix. Dev server keeps root path for simplicity.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/number-listening/' : '/',
  plugins: [react()],
}));
