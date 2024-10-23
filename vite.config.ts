import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
       'stream/consumers': 'stream-consumers'
    },
  },
  optimizeDeps: {
    exclude: ['stream/consumers']
  }
})

// import { defineConfig } from 'vite'

// export default defineConfig({
//   resolve: {
//     alias: {
//       'stream/consumers': 'stream-consumers'
//     }
//   },
//   optimizeDeps: {
//     exclude: ['stream/consumers']
//   }
// })
