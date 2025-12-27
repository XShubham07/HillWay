import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // 🔥 THIS LINE FIXES .lottie ISSUE
  assetsInclude: ["**/*.lottie"],

  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "fancifully-unsystematical-jayne.ngrok-free.dev"
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
