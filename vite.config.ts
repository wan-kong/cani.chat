import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import tailwind from 'tailwindcss'

import autoprefixer from 'autoprefixer'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [vue(),],
  server: {
    port: 9999
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', '@vueuse/core', 'radix-vue'],
          pinia: ['pinia', 'pinia-plugin-persistedstate'],
          markdown: [
            'markdown-it',
            'markdown-it-for-inline',
            'markdown-it-mark',
          ],
          lucide: ['lucide-vue-next'],
          highlight: ['highlight.js'],
          utilities: ['class-variance-authority', 'clsx'],
        }
      }
    }
  }
})
