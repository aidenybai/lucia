import VDom from './vdom';

export default class Lucia extends VDom {
  data: any;

  constructor(options: any) {
    super(document.querySelector(options.el));

    const paint = this.paint;
    this.data = new Proxy(options.data, {
      set(target, key, value) {
        target[key] = value;
        paint();
        return true;
      },
      deleteProperty(target, key) {
        delete target[key];
        paint();
        return true;
      },
    });

    paint();
  }

  paint(cb?: any) {
    this.patch(this.vdom, this.data);
    if (cb) cb();
  }
}
