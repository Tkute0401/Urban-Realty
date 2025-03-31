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
  define: {
    'process.env': {
      VITE_API_BASE_URL: JSON.stringify(process.env.VITE_API_BASE_URL),
      VITE_GOOGLE_MAPS_API_KEY: JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY)
    }
  },
  build: {
    outDir: '../client/dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          maps: ['@react-google-maps/api', 'react-leaflet'],
        }
      }
    }
  }
});