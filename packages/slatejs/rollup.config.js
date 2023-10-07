import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
export default {
  input: 'src/index.ts',
  plugins: [typescript()],
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
