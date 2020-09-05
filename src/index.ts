import VDom from './vdom';

class Lucia extends VDom {
  constructor(options: any) {
    super(document.querySelector(options.el || 'body'), options.data || {});

    this.patch(this.vdom, this.data);

    if (options.mounted) options.mounted();
  }
}

export default Lucia;