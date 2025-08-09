import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost',
    strictPort: false,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5052',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/uploads': {
        target: 'http://localhost:5052',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    sourcemap: true
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  }
})