import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import cdn from 'vite-plugin-cdn-import';
import logBuildInfo from 'vite-plugin-log-buildinfo';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'deer-engine': ['deer-engine'],
          'deer-canvas': ['deer-canvas'],
          'lodash-es': ['lodash-es'],
        },
      },
    },
  },
  plugins: [
    react(),
    viteExternalsPlugin(
      {
        //    'physx-js-webidl': 'PhysX',
        'monaco-editor': 'Monaco',
      },
      { disableInServe: true }
    ),
    cdn({
      prodUrl: 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}',
      modules: [
        // {
        //   name: 'physx-js-webidl',
        //   path: 'physx-js-webidl.js',
        //   var: 'PhysX',
        // },
        {
          name: 'monaco-editor',
          path: 'min/vs/loader.js',
          var: 'Monaco',
        },
      ],
    }),
    visualizer(),
    logBuildInfo(),
  ],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
});
