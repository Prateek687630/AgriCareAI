import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ONNX Runtime loads its WebAssembly files at runtime; pre-bundling breaks those paths
  optimizeDeps: {
    exclude: ['onnxruntime-web'],
  },
  server: {
    port: 5173,
    open: true,
  },
})
