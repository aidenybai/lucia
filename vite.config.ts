import { resolve } from 'path';

export default {
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'src/core'),
      '@directives': resolve(__dirname, 'src/core/directives'),
      '@utils': resolve(__dirname, 'src/core/utils'),
      '@models': resolve(__dirname, 'src/models'),
    },
  },
};
