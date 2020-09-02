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
  $data: any;

  constructor(options: LuciaOptions) {
    this.$el = document.querySelector(options.el);

    this.Data = new Data(options.data, this.paint.bind(this));
    this.VDom = new VDom(this.$el);

    this.$data = this.Data.data;

    this.paint();
  }

  paint(cb?: any) {
    this.VDom.patch(this.VDom.vdom, this.Data.data);
    if (cb) cb();
  }
}
