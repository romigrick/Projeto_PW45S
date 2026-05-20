
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Add alias for @ to point to src directory
      '@': path.resolve(__dirname, './src'),
    },
    // Use dedupe to ensure single instances of key libraries
    dedupe: ['react', 'react-dom'],
  },
});
