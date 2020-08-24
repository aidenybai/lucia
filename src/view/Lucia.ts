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

  constructor(options: LuciaOptions) {
    this.LuciaConfig = LuciaConfig;

    this.el = document.querySelector(options.el);
    this.dom = this.el.innerHTML;

    this.DataManager = new DataManager(options.data);
    this.ViewManager = new ViewManager(options.methods);

    this.flush();

    const toBind: any[] = [];
    this.LuciaConfig.directives.ids.forEach((id: any) => {
      const directiveArray = this.ViewManager.traverseAttributes(
        this.el,
        this.LuciaConfig.directives.prefix,
        id
      );
      if (directiveArray.length > 0) toBind.push(directiveArray);
    });
    console.log(toBind);
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
    this.ViewManager.call(method);
  }

  flush() {
    this.el.innerHTML = this.DataManager.bindInterop(this.dom, this.DataManager.data, this.LuciaConfig);
  }
}
