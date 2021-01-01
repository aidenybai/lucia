import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';

const config = {
  name: 'Lucia',
  globals: {},
  strict: true,
};

const browser = (format, folder = '') => ({
  input: './src/browser.ts',
  external: [],
  plugins: [
    resolve({ extensions: ['.ts'] }),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: { compilerOptions: { target: format } },
    }),
    cleanup()
  ],
  output: [
    {
      file: `dist${folder}/lucia.js`,
      format: 'iife',
      ...config,
    },
    {
      file: `dist${folder}/lucia.min.js`,
      plugins: [terser({ format: { comments: false } })],
      format: 'iife',
      ...config,
    },
  ],
});

const index = (format, folder = '') => ({
  input: './src/index.ts',
  external: [],
  plugins: [
    resolve({ extensions: ['.ts'] }),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: { compilerOptions: { target: format } },
    }),
    cleanup()
  ],

  output: [
    {
      file: `dist${folder}/lucia.esm.js`,
      format: 'esm',
      ...config,
    },
    {
      file: `dist${folder}/lucia.esm.min.js`,
      plugins: terser({ format: { comments: false } }),
      format: 'esm',
      ...config,
    },
    {
      file: `dist${folder}/lucia.cjs.js`,
      format: 'cjs',
      ...config,
    },
    {
      file: `dist${folder}/lucia.cjs.min.js`,
      plugins: terser({ format: { comments: false } }),
      format: 'cjs',
      ...config,
    },
  ],
});

export default [
  browser('esnext'),
  index('esnext'),
  browser('es5', '/legacy'),
  index('es5', '/legacy'),
];
