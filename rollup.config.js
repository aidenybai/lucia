import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { main, browser } from './package.json';

const config = {
  name: 'Lucia',
  globals: {},
  strict: false,
};

export default [
  {
    input: './src/browser.ts',
    external: [],
    plugins: [
      resolve({ extensions: ['.ts'] }),
      commonjs(),
      babel({
        extensions: ['.ts'],
        babelHelpers: 'bundled',
        include: ['src/**/*'],
      }),
    ],

    output: [
      {
        file: main,
        format: 'umd',
        ...config,
      },
      {
        file: browser,
        plugins: terser(),
        format: 'umd',
        ...config,
      },
      {
        file: 'dist/lucia.iife.js',
        format: 'iife',
        ...config,
      },
      {
        file: 'dist/lucia.iife.min.js',
        plugins: terser(),
        format: 'iife',
        ...config,
      },
    ],
  },
  {
    input: './src/index.ts',
    external: [],
    plugins: [
      resolve({ extensions: ['.ts'] }),
      commonjs(),
      babel({
        extensions: ['.ts'],
        babelHelpers: 'bundled',
        include: ['src/**/*'],
      }),
    ],
    output: [
      {
        file: 'dist/lucia.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/lucia.cjs.min.js',
        format: 'cjs',
        plugins: [terser()],
      },
      {
        file: 'dist/lucia.esm.js',
        format: 'esm',
      },
      {
        file: 'dist/lucia.esm.min.js',
        format: 'esm',
        plugins: [terser()],
      },
    ],
  },
];
