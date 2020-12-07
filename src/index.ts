// Exports wrapped in Lucia namespace
import { DIRECTIVE_PREFIX } from './defaults';

import { App, createApp } from './App';

import { compile, flat } from './vdom/compile';
import h from './vdom/h';
import observer from './vdom/observer';
import patch from './vdom/patch';

import { computeProperties as compute, safeEval } from './vdom/utils/compute';
import props from './vdom/utils/props';

export { App, createApp, h, compile, patch, observer, props, compute, flat };

export const init = (element: HTMLElement | Document = document, directive: string = 'use') => {
  const elements = [...element.querySelectorAll(`[${DIRECTIVE_PREFIX + directive}]`)];

  elements.map((el) => {
    const view = el.getAttribute(DIRECTIVE_PREFIX + directive);
    if (view === null) return;

    try {
      const app = createApp(safeEval(view));
      app.mount(el as HTMLElement);
    } catch (err) {}
  });
};
