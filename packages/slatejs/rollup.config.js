/* eslint-disable import/no-anonymous-default-export */
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import postcss from 'rollup-plugin-postcss';
import svgr from '@svgr/rollup';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    plugins: [typescript(), url(), postcss({})],
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
  },
  {
    input: 'src/index.ts',
    plugins: [typescript(), dts(), postcss({})],
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
  },
];
