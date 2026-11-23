import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // Local tooling folders (installed skills, audit output) are not part of the app
    exclude: [...configDefaults.exclude, '.claude/**', '.hallmark/**'],
  },
})
