import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../client/dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          query: ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          maps: ['leaflet', 'react-leaflet', '@react-google-maps/api'],
          charts: ['recharts'],
          vendor: ['axios', 'lodash', 'date-fns', 'swiper', 'react-slick', 'react-toastify', 'formik', 'yup'],
        }
      }
    }
  }
});