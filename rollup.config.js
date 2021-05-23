import beep from '@rollup/plugin-beep';
import commonjs from '@rollup/plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import resolve from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import ts from '@wessberg/rollup-plugin-ts';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';

const name = 'Lucia';

const generateConfig = (input, config) => ({
  input,
  plugins: [
    eslint(),
    commonjs(),
    resolve({ extensions: ['.ts'] }),
    ts(),
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

  config.output.forEach((fileName) => {
    const isMinifiedBuildOutput = /min/gi.test(fileName);
    const defaultBuildOptions = {
      file: fileName,
      format: config.format,
      name,
      strict: true,
    };

    if (isMinifiedBuildOutput) {
      // Production build
      buildOutput.push({
        ...defaultBuildOptions,
        plugins: [
          terser(),
          filesize({
            showBrotliSize: true,
            showMinifiedSize: false,
            showBeforeSizes: 'release',
            showGzippedSize: false,
          }),
        ],
      });
    } else {
      // Development build
      buildOutput.push(defaultBuildOptions);
    }
  });

  return generateConfig(input, {
    output: buildOutput,
  });
};

export default [
  build('./src/index.ts', {
    output: ['dist/lucia.esm.js'],
    format: 'esm',
  }),
  build('./src/index.ts', {
    output: ['dist/lucia.cjs.js'],
    format: 'cjs',
  }),
  build('./src/index.ts', {
    output: ['dist/lucia.umd.js'],
    format: 'umd',
  }),
  build('./src/browser.ts', {
    output: ['dist/lucia.js', 'dist/lucia.min.js'],
    format: 'iife',
  }),
];
