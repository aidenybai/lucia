import VDom from './vdom';

export class App extends VDom {
  constructor(options: Record<string, unknown>) {
    super(options || {});
  }
}

export const createApp = (options: Record<string, unknown>) => {
  return new App(options);
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

document.addEventListener('DOMContentLoaded', () => {
  const elements = Array.from(document.querySelectorAll('[l-use]'));

  for (const el of elements) {
    const options = el.getAttribute('l-use');
    if (options === null) return;

    try {
      const out = new Function(`return (${options})`)();
      const app = createApp(out);
      app.mount(el);
    } catch (err) {}
  }
});
