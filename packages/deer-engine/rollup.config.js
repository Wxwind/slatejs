import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import dts from 'rollup-plugin-dts';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
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
