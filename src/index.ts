// Exports wrapped in Lucia namespace
import { DIRECTIVE_PREFIX } from './models/generics';
import component from './component';

import render from './core/render';
import compile from './core/compile';
import reactive from './core/reactive';
import { directives } from './core/directive';
import { getCustomProp } from './core/utils/customProp';
import computeExpression from './core/utils/computeExpression';

export { component, compile, render, reactive, directives, computeExpression };

export const init = (element: HTMLElement | Document = document): void => {
  const stateDirective = `${DIRECTIVE_PREFIX}state`;
  const initDirective = `${DIRECTIVE_PREFIX}init`;

  const elements = element.querySelectorAll(`[${stateDirective}]`);
  // Filter out uninit scopes only
  const uninitializedComponents = [...elements].filter(
    (el) => getCustomProp(el as HTMLElement, '__l') === undefined
  );

  for (const el of uninitializedComponents) {
    const stateExpression = el.getAttribute(stateDirective);
    const initExpression = el.getAttribute(initDirective);

    try {
      // Parse state from state expression
      const state = new Function(`return ${stateExpression || '{}'}`);
      const init = initExpression ? new Function(`return ${initExpression}`) : undefined;
      component(state()).mount(el as HTMLElement);
      if (init) init();
    } catch (err) {
      console.warn(`Lucia Error: "${err}"\n\nExpression: "${stateExpression}"\nElement:`, el);
    }
  }
};
