import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the Mission Board app
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
