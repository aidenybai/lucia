import VDom from './vdom';
import compute from './helpers/compute';
import directives from './directives';
import observer from './observer';

export { compute, directives, observer };

export class App extends VDom {
  constructor(options: Record<string, unknown>) {
    super(options || {});
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
