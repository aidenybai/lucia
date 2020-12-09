import { LUCIA_COMPILE_REQUEST, Directives, Components, View, VNode } from './defaults';

import compile from './vdom/compile';
import { directives } from './vdom/directive';
import observer from './vdom/observer';
import patch from './vdom/patch';

export class App {
  vdom: VNode | null;
  view: View;
  directives: Directives;
  components: Components;
  mounted: boolean;

  constructor(view: View = {}) {
    this.vdom = null;
    this.view = view;
    this.directives = {};
    this.components = {};
    this.mounted = false;
  }

  public mount(el: HTMLElement | string, shallow: boolean = false): View {
    this.vdom = this.compile(
      (typeof el === 'string' ? document.querySelector(el) : el) as HTMLElement
    );
    if (!shallow) {
      this.view = observer(this.view, this.patch.bind(this));
      this.directives = directives;
    }

    this.mounted = true;
    this.patch([LUCIA_COMPILE_REQUEST]);
    return this.view;
  }

  public component(name: string, fn: Function) {
    this.components[name.toUpperCase()] = fn;
  }

  public directive(name: string, fn: Function) {
    this.directives[name.toUpperCase()] = fn;
  }

  // Use internal private methods, should not be used when instantiated by the user
  private patch(this: App, keys?: string[]): void {
    if (!this.mounted) throw new Error('App is not mounted.');
    patch(this.vdom as VNode, this.view, this.directives, keys);
  }

  private compile(el: HTMLElement): VNode {
    return compile(el, this.view, this.components, true) as VNode;
  }
}

export const createApp = (view: View) => {
  return new App(view);
};

export default createApp;
