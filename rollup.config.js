import { uglify } from 'rollup-plugin-uglify';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import license from 'rollup-plugin-license';
import pkg from './package.json';

const extensions = ['.js', '.ts'];

const name = 'Lucia';

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
    license({
      banner: {
        commentStyle: 'ignored',
        content: `Lucia v${pkg.version}\n(c) 2020-present Aiden Bai\nReleased under the MIT License.`,
      },
    })
  ],

  output: [
    {
      file: pkg.main,
      format: 'umd',
      name,
      globals: {},
      strict: false,
    },
    {
      file: pkg.browser,
      format: 'umd',
      plugins: uglify(),
      name,
      globals: {},
      strict: false,
    },
  ],
};
