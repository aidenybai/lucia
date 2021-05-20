import beep from '@rollup/plugin-beep';
import commonjs from '@rollup/plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import resolve from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const name = 'Lucia';

const generateConfig = (input, config) => ({
  input,
  external: [],
  plugins: [
    eslint(),
    commonjs(),
    resolve({ extensions: ['.ts'] }),
    typescript({
      useTsconfigDeclarationDir: true,
      typescript: require('ttypescript'),
      tsconfigOverride: {
        compilerOptions: {
          target: config.target,
          plugins: [
            { transform: 'typescript-transform-paths' },
            { transform: 'typescript-transform-paths', afterDeclarations: true },
          ],
        },
      },
    }),
    strip({
      functions: ['console.log'],
      include: '**/*.(ts)',
    }),
    beep(),
  ],
  output: config.output,
  onwarn: () => {},
});

export const build = (input, config) => {
  const buildOutput = [];

  // Development build
  buildOutput.push({
    file: config.output[0],
    format: config.format,
    name,
    globals: {},
    strict: true,
  });

  // Production build
  if (config.output.length === 2) {
    buildOutput.push({
      file: config.output[1],
      format: config.format,
      plugins: [
        terser(),
        filesize({
          showBrotliSize: true,
          showMinifiedSize: false,
          showBeforeSizes: 'release',
          showGzippedSize: false,
        }),
      ],
      name,
      globals: {},
      strict: true,
    });
  }

  return generateConfig(input, {
    output: buildOutput,
    target: config.target,
  });
};

export default [
  build('./src/index.ts', {
    output: ['dist/lucia.esm.js'],
    format: 'esm',
    target: 'es2020',
  }),
  build('./src/index.ts', {
    output: ['dist/lucia.cjs.js'],
    format: 'cjs',
    target: 'es2020',
  }),
  build('./src/browser.ts', {
    output: ['dist/lucia.js', 'dist/lucia.min.js'],
    format: 'iife',
    target: 'es2020',
  }),
];
