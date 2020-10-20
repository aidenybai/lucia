import VDom from './vdom';

export class Lucia extends VDom {
  constructor(options: Record<string, unknown>) {
    super(options || {});
  }
}

export const createApp = (options: Record<string, unknown>) => {
  return new Lucia(options);
};

document.addEventListener('DOMContentLoaded', () => {
  const components = Array.from(document.querySelectorAll('[l-use]'));

  for (const component of components) {
    const options = component.getAttribute('l-use');
    if (options === null) return;
    const app = createApp(eval(options));
    app.mount(component);
  }
});
