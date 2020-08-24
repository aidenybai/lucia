import LuciaConfig from './config/LuciaConfig';
import LuciaOptions from './config/LuciaOptions';

export default class Lucia {
  el: any;
  dom: any;
  data: any;
  methods: any;

  constructor(options: LuciaOptions) {
    this.el = document.querySelector(options.el);
    this.dom = this.el.innerHTML;
    this.data = options.data;
    this.methods = options.methods;

    this.el.innerHTML = this.bindInterop(this.dom);
    console.log(this.traverseAttributes(this.el, 'l-', 'on'));
  }

  set(key: string, value: any): void {
    this.data[key] = value;
    this.el.innerHTML = this.bindInterop(this.dom);
  }

  delete(key: string): void {
    this.data[key] = '';
    this.el.innerHTML = this.bindInterop(this.dom);
  }

  call(method: string): void {
    this.methods[method]();
  }

  bindInterop(html: string): string {
    const tokens = html.match(LuciaConfig.matchInteropRegex) || [];
    for (let i = 0; i < tokens.length; i++) {
      const compressedToken = tokens[i].replace(LuciaConfig.curlyBraceTrimRegex, '$1$2');
      const dataKey = compressedToken.substring(2, compressedToken.length - 2);
      html = html.replace(tokens[i], this.data[dataKey]);
    }
    return html;
  }

  traverseAttributes(el: any, prefix: string, id: string): any[] {
    const toBind: any[] = [];
    const descendents = [...el.getElementsByTagName('*')]; // gets all children of ancestor
    descendents.forEach((child) => {
      const attr = child.getAttribute(`${prefix}${id}`);
      if (attr) {
        toBind.push({
          el: child,
          id,
          attr,
        });
      }
    });

    // todo: add bindings for elements
    return toBind;
  }
}
