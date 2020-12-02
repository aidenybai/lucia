// Exports wrapped in Lucia namespace
import { DIRECTIVE_PREFIX, Components, View } from './defaults';

import { App, createApp } from './App';

import compile from './vdom/compile';
import { h, render } from './vdom/h';
import observer from './vdom/observer';
import patch from './vdom/patch';

import { computeProperties as compute, safeEval } from './vdom/utils/compute';
import props from './vdom/utils/props';

export { App, createApp, h, render, compile, patch, observer, props, compute };

export const component = (name: string, fn: Function) => {
  return { name, fn };
};

// Lucia.use function for user provided views in JavaScript
export const use = (name: string, view: View, ...components: Components[]): App | void => {
  const elements = Array.from(document.querySelectorAll(`[${DIRECTIVE_PREFIX}use]`));
  const element = elements.filter((el) => el.getAttribute(`${DIRECTIVE_PREFIX}use`) === name)[0];
  const app = createApp(view);

  components.map(({ name, fn }: Record<string, string | Function>) => {
    app.component(name as string, fn as Function);
  });
  app.mount(element as HTMLElement);
  return app;
};

// Init function if requested. Normally used if l-use but no Lucia.use is provided
export const init = (element: HTMLElement | Document = document, directive: string = 'use') => {
  const elements = Array.from(element.querySelectorAll(`[${DIRECTIVE_PREFIX + directive}]`));

  elements.map((el) => {
    const view = el.getAttribute(DIRECTIVE_PREFIX + directive);
    if (view === null) return;

    try {
      const app = createApp(safeEval(view));
      app.mount(el as HTMLElement);
    } catch (err) {}
  });
};
