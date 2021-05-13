import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import babel from '@rollup/plugin-babel';
import strip from '@rollup/plugin-strip';
import beep from '@rollup/plugin-beep';

const name = 'Lucia';
const legacy = () => {
  return babel({
    extensions: ['.ts'],
    babelHelpers: 'bundled',
    include: ['src/**/*'],
  });
};

const generateConfig = (input, config) => ({
  input,
  external: [],
  plugins: [
    commonjs(),
    resolve({ extensions: ['.ts'] }),
    filesize({
      showBrotliSize: true,
      showMinifiedSize: false,
      showGzippedSize: false,
    }),
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
    config.legacy ? legacy() : undefined,
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
  buildOutput.push({
    file: config.output[1],
    format: config.format,
    plugins: [terser({ format: { comments: false } })],
    name,
    globals: {},
    strict: true,
  });

  return generateConfig(input, {
    output: buildOutput,
    legacy: config.legacy,
    target: config.target,
  });
};

export default [
  build('./src/browser.ts', {
    output: ['dist/lucia.js', 'dist/lucia.min.js'],
    format: 'iife',
    target: 'es2018',
  }),
  build('./src/index.ts', {
    output: ['dist/lucia.esm.js', 'dist/lucia.esm.min.js'],
    format: 'esm',
    target: 'es2018',
  }),
  build('./src/index.ts', {
    output: ['dist/lucia.cjs.js', 'dist/lucia.cjs.min.js'],
    format: 'cjs',
    target: 'es2018',
  }),
  build('./src/index.ts', {
    output: ['dist/legacy/lucia.cjs.js', 'dist/legacy/lucia.cjs.min.js'],
    format: 'cjs',
    target: 'es5',
    legacy: true,
  }),
];
