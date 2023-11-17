/* eslint-disable import/no-anonymous-default-export */
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import postcss from 'rollup-plugin-postcss';
import svgr from '@svgr/rollup';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';

export default [
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
