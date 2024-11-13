const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const alias = require('@rollup/plugin-alias');
const { dts } = require('rollup-plugin-dts');
const babel = require('@rollup/plugin-babel');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

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
      resolve({
        resolveOnly: (module) => {
          const excludes = ['physx-js-webidl'];
          const needInclue = !excludes.includes(module);
          if (!needInclue) {
            console.log(`module ${module} is excluded.`);
          }
          return needInclue;
        },
      }),
      commonjs(),
      babel({
        exclude: ['node_modules/**'],
        extensions: ['ts', 'tsx', 'mjs', 'js', 'jsx'],
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
        plugins: [['@babel/plugin-proposal-decorators', { version: '2023-05' }]],
        babelHelpers: 'bundled',
      }),
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
      resolve({
        resolveOnly: (module) => {
          const excludes = ['physx-js-webidl'];
          const needInclue = !excludes.includes(module);
          if (!needInclue) {
            console.log(`module ${module} is excluded.`);
          }
          return needInclue;
        },
      }),
      commonjs(),
      babel({
        exclude: ['node_modules/**'],
        extensions: ['ts', 'tsx', 'mjs', 'js', 'jsx'],
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
        plugins: [['@babel/plugin-proposal-decorators', { version: '2023-05' }]],
      }),
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
