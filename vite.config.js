import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // By default , vite outputs hashed filenames(bad for extensions). This ensures files are predictable (index.js, not index-xyz123.js)
  build: {  
    rollupOptions: {
      input: {
        main: 'index.html',
        background: './public/background.js'
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
})
