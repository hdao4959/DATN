import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Marking browser-specific globals as external to avoid bundling issues
      external: ['location', 'navigator'],
    },
  },
})
