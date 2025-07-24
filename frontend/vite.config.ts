import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/songs': {
      target: 'http://127.0.0.1:8787',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/songs/, '/api/songs'),
    },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
