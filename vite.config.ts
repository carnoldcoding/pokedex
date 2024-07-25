import { defineConfig } from 'vite';

export default defineConfig({
  base: '/pokedex/',
  server: {
    hmr: true, // Hot Module Replacement is enabled by default
    host: '0.0.0.0', // Allows access from any IP address
    port: 3000, // Or your chosen port
  },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: './index.html'
        }
      }
    }
  });