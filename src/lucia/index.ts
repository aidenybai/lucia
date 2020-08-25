import VDom from './vdom';
import Instance from './instance';
import Directives from './directives';
import LuciaConfig from '../constants/config';

interface LuciaOptions {
  el: string;
  data?: Record<string, any>;
  methods?: Record<string, any>;
}

export default class Lucia {
  LuciaConfig: any;
  Instance: Instance;
  Directives: Directives;
  VDom: VDom;
  el: any;
  dom: any;
  directives: any;

  constructor(options: LuciaOptions) {
    this.LuciaConfig = LuciaConfig;

    this.el = document.querySelector(options.el);

    this.Instance = new Instance(options.data, options.methods);
    this.Directives = new Directives();
    this.VDom = new VDom(this.el);

    this.repaint();
  }

  has(key: string): boolean {
    return this.Instance.has(key);
  }

  get(key: string): any {
    return this.Instance.get(key);
  }

  set(key: string, value: any): void {
    this.Instance.set(key, value);
    this.repaint();
  }

  delete(key: string): void {
    this.Instance.delete(key);
    this.repaint();
  }

  call(method: string): void {
    this.Instance.call(method);
  }

  loadDirectives() {
    this.directives = {};

    this.directives = this.Directives.collateDirectives(
      this.el,
      this.LuciaConfig.directives.prefix,
      this.LuciaConfig.directives.ids
    );
    this.Directives.bindDirectives(this.directives, this.Instance);
  }

  loadTemplates() {
    this.el.innerHTML = this.Instance.interopTemplates(
      this.el.innerHTML,
      this.Instance.data,
      this.LuciaConfig
    );
  }

  repaint() {
    if (this.dom) this.el.innerHTML = this.dom;
    else this.dom = this.el.innerHTML;

    this.loadDirectives();
    this.loadTemplates();
  }
}
