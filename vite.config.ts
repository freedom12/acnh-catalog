import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  base: '/acnh-catalog/',
  publicDir: false,
  build: {
    target: 'es2015',
  },
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        // { src: 'public/catalog_items.json', dest: '.' },
        { src: 'public/translations.json', dest: '.' },
        { src: 'public/config/**', dest: 'config' },
        { src: 'public/img/**', dest: 'img' },
        { src: 'public/sound/**', dest: 'sound' },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
