import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window', // 👈 Fixes the ReferenceError for 'global'
    process: {
      env: {}, // optional, only needed if something relies on process.env
    },
  },
  server: {
    host: true, // or '0.0.0.0'
  },
})
