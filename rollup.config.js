import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const config = {
  name: 'Lucia',
  globals: {},
  strict: false,
};

export default {
  input: './src/index.ts',
  external: [],
  plugins: [
    resolve({ extensions: ['.ts'] }),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
  ],

  output: [
    {
      file: 'dist/lucia.js',
      format: 'umd',
      ...config,
    },
    {
      file: 'dist/lucia.min.js',
      plugins: terser({ format: { comments: false } }),
      format: 'umd',
      ...config,
    },
    {
      file: 'dist/lucia.esm.js',
      format: 'esm',
      ...config,
    },
    {
      file: 'dist/lucia.esm.min.js',
      plugins: terser({ format: { comments: false } }),
      format: 'esm',
      ...config,
    },
    {
      file: 'dist/lucia.cjs.js',
      format: 'cjs',
      ...config,
    },
    {
      file: 'dist/lucia.cjs.min.js',
      plugins: terser({ format: { comments: false } }),
      format: 'cjs',
      ...config,
    },
    {
      file: 'dist/lucia.iife.js',
      format: 'iife',
      ...config,
    },
    {
      file: 'dist/lucia.iife.min.js',
      plugins: terser({ format: { comments: false } }),
      format: 'iife',
      ...config,
    },
  ],
};
