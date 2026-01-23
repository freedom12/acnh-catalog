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
        { src: 'public/catalog_items.json', dest: '.' },
        { src: 'public/translations.json', dest: '.' },
        { src: 'public/config/**', dest: 'config' },
        { src: 'public/img/hhp_island_icon/**', dest: 'img/hhp_island_icon' },
        { src: 'public/img/hhp_island_img/**', dest: 'img/hhp_island_img' },
        { src: 'public/img/icon/**', dest: 'img/icon' },
        { src: 'public/img/pattern/**', dest: 'img/pattern' },
        { src: 'public/img/polishing/**', dest: 'img/polishing' },
        { src: 'public/img/soundscape/**', dest: 'img/soundscape' },
        // { src: 'public/sound/**', dest: 'sound' },
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
