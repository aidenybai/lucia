// Exports wrapped in Lucia namespace
import { DIRECTIVE_PREFIX } from './models/generics';
import { App, createApp } from './App';

import h from './vdom/h';
import patch from './vdom/patch';
import compile from './vdom/compile';
import reactive from './vdom/reactive';
import { directives, renderDirective } from './vdom/directive';

export { createApp, h, compile, patch, reactive, directives, renderDirective };

export const init = (
  element: HTMLElement | Document = document,
  directive: string = 'use'
): App[] => {
  const elements = [...element.querySelectorAll(`[${DIRECTIVE_PREFIX + directive}]`)];
  const apps: App[] = [];

  elements.map((el) => {
    const state = el.getAttribute(DIRECTIVE_PREFIX + directive);
    if (state === null) return;

    try {
      const app = createApp(new Function(`return ${state}`)());
      app.mount(el as HTMLElement);
      apps.push(app);
    } catch (err) {}
  });

  return apps;
};
