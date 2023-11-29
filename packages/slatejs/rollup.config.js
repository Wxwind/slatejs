/* eslint-disable import/no-anonymous-default-export */
const typescript = require('@rollup/plugin-typescript');
const url = require('@rollup/plugin-url');
const postcss = require('rollup-plugin-postcss');
const svgr = require('@svgr/rollup');
const { dts } = require('rollup-plugin-dts');
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json');

module.exports = [
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
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/cjs/index.d.ts',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/es/index.d.ts',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript(),
      url(),
      json(),
      dts(),
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
  },
];
