import VDom from './vdom';

class Constructor extends VDom {
  constructor(options: Record<string, any>) {
    super(options.data || {});
  }
}

export default Constructor;
