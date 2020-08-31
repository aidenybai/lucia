import VDom from './vdom';
import Data from './data';

interface LuciaOptions {
  el: string;
  data?: Record<string, any>;
}

export default class Lucia {
  Data: Data;
  VDom: VDom;
  $el: any;

  constructor(options: LuciaOptions) {
    this.$el = document.querySelector(options.el);

    this.Data = new Data(options.data);
    this.VDom = new VDom(this.$el);

    this.nextTick();
  }

  nextTick() {
    this.VDom.patch(this.VDom.vdom, this.Data.data);
  }
}
