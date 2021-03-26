import { buildAll } from './rollup.config.js';

export default buildAll('./src/browser.ts', {
  output: ['dist/lucia.js', 'dist/lucia.min.js'],
  format: 'iife',
  target: 'es2018',
});
