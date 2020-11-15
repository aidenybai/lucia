import { h, VNode } from './vdom/h';
import compile from './vdom/compile';
import patch from './vdom/patch';

import compute from './helpers/compute';
import directives from './directives/render';
import observer from './observer';

export { compute, directives, observer, h, compile, patch };

export class App {
  vdom: VNode | null;
  view: Record<string, any> | any;

  constructor(options: Record<string, any> = {}) {
    this.vdom = null;
    this.view = options;
  }

  public mount(el: string | Element): Record<string, any> | any {
    this.vdom = this._compile(typeof el === 'string' ? document.querySelector(el) : el);
    this.view = observer(this.view, this._patch.bind(this));

    this._patch(Object.keys(this.view));
    return this.view;
  }

  private _patch(keys: string[]): Record<any, any> | any {
    patch(this.vdom, this.view, keys);
  }

  private _compile(el: Element | null): Record<any, any> | any {
    return compile(el, this.view);
  }
}

export const createApp = (view: Record<string, unknown>) => {
  return new App(view);
};

export const use = (name: string, view: Record<string, unknown>): App | void => {
  const elements = Array.from(document.querySelectorAll('[l-use]'));

  for (const el of elements) {
    const component = el.getAttribute('l-use');

    if (component === name) {
      const app = createApp(view);
      app.mount(el);

      return app;
    }
  }
};

export const init = (element: HTMLElement | Document = document, directive: string = 'use') => {
  const elements = Array.from(element.querySelectorAll(`[l-${directive}]`));

  for (const el of elements) {
    const view = el.getAttribute(`l-${directive}`);
    if (view === null) return;

    try {
      const app = createApp(compute(view));
      app.mount(el);
    } catch (err) {}
  }
};

document.addEventListener('DOMContentLoaded', () => init(document, 'init'));
