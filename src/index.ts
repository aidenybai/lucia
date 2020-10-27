import VDom from './vdom';

export class App extends VDom {
  constructor(options: Record<string, unknown>) {
    super(options || {});
  }
}

export const createApp = (options: Record<string, unknown>) => {
  return new App(options);
};

export const links: Record<string, App> = {};

document.addEventListener('DOMContentLoaded', () => {
  const elements = Array.from(document.querySelectorAll('[l-use]'));

  for (const el of elements) {
    const options = el.getAttribute('l-use');
    if (options === null) return;

    const app = createApp(new Function(`return (${options})`)());
    const link = el.getAttribute('l-link');
    if (link) links[link] = app;
    app.mount(el);
  }
});
