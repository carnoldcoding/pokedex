import { defineConfig } from 'vite';

export default defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    },
    build: {
      rollupOptions: {
        input: './src/main.ts'
      }
    }
  });