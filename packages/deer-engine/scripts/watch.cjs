// rollup.watch.js
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const alias = require('@rollup/plugin-alias');
const { dts } = require('rollup-plugin-dts');

const watchOptions = [
  {
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
      alias({
        entries: [
          {
            find: '@/',
            replacement: 'src/',
          },
        ],
      }),
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [
      typescript(),
      dts(),
      alias({
        entries: [
          {
            find: '@/',
            replacement: 'src/',
          },
        ],
      }),
    ],
    output: [
      {
        file: 'dist/cjs/index.d.ts',
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: 'dist/es/index.d.ts',
        format: 'es',
        sourcemap: false,
      },
    ],
  },
];

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
