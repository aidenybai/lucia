import VDom from './vdom';
import data from './data';

export default class Lucia extends VDom {
  data: any;

  constructor(options: any) {
    super(document.querySelector(options.el));

    this.data = data(options.data, this.patch.bind(this), this.vdom);

    this.patch(this.vdom, this.data);
  }
}
