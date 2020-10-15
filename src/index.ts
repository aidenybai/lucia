import VDom from './vdom';

export class Lucia extends VDom {
  constructor(options: Record<string, unknown>) {
    super(options || {});
  }
}

export const createApp = (options: Record<string, unknown>) => {
  return new Lucia(options);
};
