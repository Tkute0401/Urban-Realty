import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  },
  build: {
    outDir: 'dist', // Changed from '../server/public'
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Added to handle large chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Example of code splitting - adjust based on your dependencies
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          vendor: ['axios', 'formik', 'yup'],
        }
      }
    }
  }
});