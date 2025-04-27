import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      events: 'events', // 🧩 Polyfill events.EventEmitter
      util: 'util',     // 🧩 Polyfill util.debuglog etc.
    },
  },
  define: {
    global: 'window',
    process: {
      env: {}, // Include this if needed
    },
  },
});