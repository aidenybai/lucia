// Exports wrapped in Lucia namespace
import { DIRECTIVE_PREFIX } from './defaults';
import { App, createApp } from './App';

import h from './vdom/h';
import patch from './vdom/patch';
import compile from './vdom/compile';
import observer from './vdom/observer';
import { directives, renderDirective } from './vdom/directive';
import { safeEval } from './vdom/utils/compute';

export { createApp, h, compile, patch, observer, directives, renderDirective };

export const init = (
  element: HTMLElement | Document = document,
  directive: string = 'use'
): App[] => {
  const elements = [...element.querySelectorAll(`[${DIRECTIVE_PREFIX + directive}]`)];
  const apps: App[] = [];

  elements.map((el) => {
    const view = el.getAttribute(DIRECTIVE_PREFIX + directive);
    if (view === null) return;

    try {
      const app = createApp(safeEval(view));
      app.mount(el as HTMLElement);
      apps.push(app);
    } catch (err) {}
  });

  return apps;
};
