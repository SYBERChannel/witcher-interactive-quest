import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true, // Ensure we listen on all addresses if needed, helpful for running in some environments
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
                // Add rewrite to ensure path matches backend expectation?
                // Assuming backend expects /api/... prefix. If backend is running on /api, this is fine.
                // If backend does NOT expect /api prefix, uncomment:
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
})
