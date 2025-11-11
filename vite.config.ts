import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const GEMINI_KEY = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '';
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Expose Gemini key as a build-time constant for client usage.
        // Note: Client-exposed keys are public; prefer a server proxy for production.
        'process.env.API_KEY': JSON.stringify(GEMINI_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(GEMINI_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
