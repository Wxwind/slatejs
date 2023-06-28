import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
export default {
  input: 'src/index.ts',
  plugins: [dts()],
  output: [
    {
      file: 'dist/index.d.ts',
      format: 'es',
    },
  ],
};
