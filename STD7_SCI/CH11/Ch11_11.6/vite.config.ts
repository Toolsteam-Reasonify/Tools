import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress extension-related warnings
        if (
          warning.message &&
          (
            warning.message.toLowerCase().includes('runtime.lasterror') ||
            warning.message.toLowerCase().includes('message port closed') ||
            warning.message.toLowerCase().includes('extension')
          )
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
})

