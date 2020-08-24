import LuciaConfig from '../config/Config';
import LuciaOptions from '../config/Options';
import DataManager from './DataManager';
import ViewManager from './ViewManager';

export default class Lucia {
  LuciaConfig: any;
  DataManager: any;
  ViewManager: any;
  el: any;
  dom: any;
  directives: any;

  constructor(options: LuciaOptions) {
    this.LuciaConfig = LuciaConfig;

    this.el = document.querySelector(options.el);
    this.dom = this.el.innerHTML;

    this.DataManager = new DataManager(options.data, options.methods);
    this.ViewManager = new ViewManager();

    this.flush();

    this.directives = {};
    this.LuciaConfig.directives.ids.forEach((id: any) => {
      const directiveArray = this.ViewManager.traverseAttributes(
        this.el,
        this.LuciaConfig.directives.prefix,
        id
      );
      if (directiveArray.length > 0) this.directives[id] = directiveArray;
    });
  }

  parse() {
    for (const directive in this.directives) {
      for (const elem of this.directives[directive]) {
        switch (directive) {
          case 'on':
            elem.el.innerHTML = `on:${elem.data}`;
            break;
          case 'bind':
            elem.el.innerHTML = `bind:${elem.data}`;
            break;
          default:
            throw new Error('Unregistered directive found');
        }
      }
    }
    // switch() {

    // } lucia.parse();
  }

  set(key: string, value: any): void {
    this.DataManager.set(key, value);
    this.flush();
  }

  delete(key: string): void {
    this.DataManager.delete(key);
    this.flush();
  }

  call(method: string): void {
    this.DataManager.call(method);
  }

  flush() {
    this.el.innerHTML = this.DataManager.interopTemplates(
      this.dom,
      this.DataManager.data,
      this.LuciaConfig
    );
  }
}
