import Constructor from './constructor';

export const createApp = (options: Record<string, any>) => {
  return new Constructor(options);
};
