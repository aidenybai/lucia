import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { main, browser } from './package.json';

const extensions = ['.ts'];
const config = {
  name: 'Lucia',
  format: 'umd',
  globals: {},
  strict: false,
};

export default {
  input: './src/index.ts',
  external: [],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*'],
    }),
  ],

  output: [
    {
      file: main,
      ...config,
    },
    {
      file: browser,
      plugins: terser(),
      ...config,
    },
  ],
};
