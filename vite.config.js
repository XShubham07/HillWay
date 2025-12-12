import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ["fancifully-unsystematical-jayne.ngrok-free.dev"], // Ngrok + all external URLs allowed
    proxy: {
      // Jab bhi hum '/api' call karenge,
      // wo automatic 'http://localhost:3000' pe jayega
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
