import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2018',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        /* split heavy vendors so the browser downloads them in parallel
           and caches them independently of app-code changes */
        manualChunks: {
          three: ['three'],
          motion: ['framer-motion'],
          scroll: ['gsap', 'lenis'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
