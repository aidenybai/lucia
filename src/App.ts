import { VNode } from './vdom/h';
import compile from './vdom/compile';
import patch from './vdom/patch';
import observer from './vdom/observer';

export class App {
  vdom: VNode | null;
  view: Record<string, unknown>;

  constructor(view: Record<string, unknown> = {}) {
    this.vdom = null;
    this.view = view;
  }

  public mount(el: string | Element, shallow: boolean = false): Record<string, unknown> {
    this.vdom = this._compile(typeof el === 'string' ? document.querySelector(el) : el);
    if (!shallow) this.view = observer(this.view, this._patch.bind(this));

    this._patch();
    return this.view;
  }

  // Use internal private methods, should not be used when instantiated by the user
  private _patch(keys?: string[]): void {
    patch(this.vdom, this.view, keys);
  }

  private _compile(el: Element | null): VNode {
    return compile(el, this.view) as VNode;
  }
}

export const createApp = (view: Record<string, unknown>) => {
  return new App(view);
};

export default createApp;
