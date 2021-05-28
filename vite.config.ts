import { resolve } from 'path';

export default {
  root: 'dev',
  resolve: {
    alias: {
      lucia: resolve(__dirname, 'src/index.ts'),
      '@core': resolve(__dirname, 'src/core'),
      '@directives': resolve(__dirname, 'src/core/directives'),
      '@utils': resolve(__dirname, 'src/core/utils'),
      '@models': resolve(__dirname, 'src/models'),
    },
  },
};
