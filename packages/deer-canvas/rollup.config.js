import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/index.ts',
    plugins: [
      // resolve(),
      // commonjs(),
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
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/es/index.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [
      // resolve(),
      // commonjs(),
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
