import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
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
    cleanup(),
  ],
  output: [
    {
      file: `dist${folder}/lucia.js`,
      format: 'iife',
      ...config,
    },
  ],
});

export default [browser('esnext')];
