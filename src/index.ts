import VDom from './vdom';

export class Lucia extends VDom {
  constructor(options: Record<string, any>) {
    super(options || {});
  }
}

export const createApp = (options: Record<string, any>) => {
  return new Lucia(options);
}
