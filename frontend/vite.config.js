// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 2000,
    proxy: {
      '/batteries': {
        target: 'http://localhost:1000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
