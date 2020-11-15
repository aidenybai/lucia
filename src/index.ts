import { h, VNode } from './vdom/h';
import compile from './vdom/compile';
import patch from './vdom/patch';
import observer from './vdom/observer';
import { props, DIRECTIVE_PREFIX } from './vdom/helpers/props';
import selector from './vdom/helpers/selector';

import compute from './utils/compute';
import { render, directives } from './directives/render';

export { h, compile, patch, observer, props, selector, compute, render, directives };

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
  const elements = Array.from(document.querySelectorAll(`[${DIRECTIVE_PREFIX}use]`));

  for (const el of elements) {
    const component = el.getAttribute(`${DIRECTIVE_PREFIX}use`);

    if (component === name) {
      const app = createApp(view);
      app.mount(el);

      return app;
    }
  }
};

export const init = (element: HTMLElement | Document = document, directive: string = 'use') => {
  const elements = Array.from(element.querySelectorAll(`[${DIRECTIVE_PREFIX + directive}]`));

  for (const el of elements) {
    const view = el.getAttribute(DIRECTIVE_PREFIX + directive);
    if (view === null) return;

    try {
      const app = createApp(compute(view));
      app.mount(el);
    } catch (err) {}
  }
};

document.addEventListener('DOMContentLoaded', () => init(document, 'init'));
