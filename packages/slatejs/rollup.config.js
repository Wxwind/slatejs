import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
export default {
  input: 'src/index.ts',
  plugins: [typescript(), svgr(), postcss({})],
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
