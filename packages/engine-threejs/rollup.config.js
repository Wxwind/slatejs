import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';

export default {
  input: 'src/index.ts',
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
};
