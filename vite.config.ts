import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tsconfigPaths jika masih ada

export default defineConfig({
  plugins: [react()], 
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})