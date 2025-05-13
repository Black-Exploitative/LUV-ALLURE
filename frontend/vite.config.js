import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
  server: {
    allowedHosts: ['backend-mocha-eta-71.vercel.app','*'],
    proxy: {
      '/api': {
        target: 'https://backend-mocha-eta-71.vercel.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})