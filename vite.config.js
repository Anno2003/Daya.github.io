// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
	gallery: 'gallery.html',
      },
    },
  },
})