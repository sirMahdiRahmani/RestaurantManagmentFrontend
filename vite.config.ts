/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    // Tests always run against in-memory repos, regardless of the developer's
    // local .env (which may point at a real backend for manual dev/testing).
    env: { VITE_USE_MOCK_REPOS: 'true' },
  },
})
