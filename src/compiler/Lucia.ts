import LuciaConfig from '../utils/Config';
import LuciaOptions from '../utils/Options';
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

    this.DataManager = new DataManager(options.data, options.methods);
    this.ViewManager = new ViewManager();

    this.repaint();
  }

  has(key: string): boolean {
    return this.DataManager.has(key);
  }

  get(key: string): any {
    return this.DataManager.get(key);
  }

  set(key: string, value: any): void {
    this.DataManager.set(key, value);
    this.repaint();
  }

  delete(key: string): void {
    this.DataManager.delete(key);
    this.repaint();
  }

  call(method: string): void {
    this.DataManager.call(method);
  }

  loadDirectives() {
    console.log('directive fired');
    this.directives = {};

    for (const id of this.LuciaConfig.directives.ids) {
      const directiveArray = this.ViewManager.traverseAttributes(
        this.el,
        this.LuciaConfig.directives.prefix,
        id
      );
      if (directiveArray.length > 0) this.directives[id] = directiveArray;
    };

    for (const directive in this.directives) {
      for (const viewNode of this.directives[directive]) {
        switch (directive) {
          case 'if':
            if (this.has(viewNode.data)) {
              viewNode.el.hidden = this.get(viewNode.data) ? false : true;
              console.log(viewNode.el);

              // lucia.set('stuff', false);
            }
            break;
          case 'on':
            break;
          case 'bind':
            break;
          default:
            throw new Error('Unregistered directive found');
        }
      }
    }
  }

  loadTemplates() {
    this.el.innerHTML = this.DataManager.interopTemplates(
      this.el.innerHTML,
      this.DataManager.data,
      this.LuciaConfig
    );
  }

  repaint() {
    console.log('repaint fired');
    if (this.dom) this.el.innerHTML = this.dom;
    else this.dom = this.el.innerHTML;

    this.loadDirectives();
    this.loadTemplates();
  }
}
