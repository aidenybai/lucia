import { VNode } from './vdom/h';
import compile from './vdom/compile';
import patch from './vdom/patch';
import observer from './vdom/observer';
import DirectivesManager from './vdom/directives';

export class App {
  vdom: VNode | null;
  view: Record<string, unknown>;
  manager: DirectivesManager;
  components: Record<string, string>;

  constructor(view: Record<string, unknown> = {}) {
    this.vdom = null;
    this.view = view;
    this.manager = new DirectivesManager();
    this.components = {};
  }

  public mount(el: string | Element, shallow: boolean = false): Record<string, unknown> {
    this.vdom = this.compile(typeof el === 'string' ? document.querySelector(el) : el);
    if (!shallow) this.view = observer(this.view, this.patch.bind(this));

    this.patch();
    return this.view;
  }

  public component(name: string, template: string) {
    this.components[name.toUpperCase()] = template;
  }

  public directive(name: string, fn: Function) {
    this.manager.register(name, fn);
  }

  // Use internal private methods, should not be used when instantiated by the user
  private patch(keys?: string[]): void {
    patch(this.vdom, this.view, this.manager, keys);
  }

  private compile(el: Element | null): VNode {
    return compile(el, this.view, this.components) as VNode;
  }
}

export const createApp = (view: Record<string, unknown>) => {
  return new App(view);
};

export default createApp;
