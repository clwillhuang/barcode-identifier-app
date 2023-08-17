import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    base: '/app/',
    plugins: [react()],
    assetsInclude: ['**/*.md'],
  };
});