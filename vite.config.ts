import { defineConfig, DepOptimizationOptions } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // reactJsx()
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'noact/src'
    })
  ]
})
