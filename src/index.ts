import VDom from './vdom';

class Lucia extends VDom {
  constructor(options: Record<string, any>) {
    super(options || {});
  }
}

export const createApp = (options: Record<string, any>) => {
  return new Lucia(options);
}

export default Lucia;