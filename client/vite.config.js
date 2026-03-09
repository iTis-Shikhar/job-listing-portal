import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose both VITE_-prefixed and API_-prefixed env vars to browser code
  envPrefix: ['VITE_', 'API_'],
})
