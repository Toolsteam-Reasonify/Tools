import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    hmr: {
      overlay: true,
    },
    cors: true,
  },
  optimizeDeps: {
    exclude: [],
    include: ['react', 'react-dom', 'framer-motion'],
  },
})
