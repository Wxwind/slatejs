// rollup.watch.js
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json');
const url = require('@rollup/plugin-url');
const postcss = require('rollup-plugin-postcss');

const watchOptions = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
    },
    {
      file: 'dist/es/index.js',
      format: 'es',
    },
  ],
  plugins: [
    typescript(),
    json(),
    url(),
    postcss({}),
    alias({
      entries: [
        {
          find: '@/',
          replacement: 'src/',
        },
      ],
    }),
  ],
};

const watcher = rollup.watch(watchOptions);

console.log('Rollup is watching for changes...');

watcher.on('event', (event) => {
  switch (event.code) {
    case 'START':
      console.info('Rebuilding...');
      break;
    case 'BUNDLE_START':
      console.info('Bundling...');
      break;
    case 'BUNDLE_END':
      console.info('Bundled!');
      break;
    case 'END':
      console.info('Done!');
      break;
    case 'ERROR':
    case 'FATAL':
      console.error('Rollup error: ', event);
  }
});

process.on('exit', () => {
  // 停止监听
  watcher.close();
});
