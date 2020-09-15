import Lucia from './lucia';

export const createApp = (options: Record<string, any>) => {
  return new Lucia(options);
};
