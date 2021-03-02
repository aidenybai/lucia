// Exports wrapped in Lucia namespace
import { DIRECTIVE_PREFIX } from './models/generics';
import component from './component';

import render from './core/render';
import compile from './core/compile';
import reactive from './core/reactive';
import { directives } from './core/directive';
import { getElementCustomProp } from './core/utils/elementCustomProp';
import computeExpression from './core/utils/computeExpression';

export { component, compile, render, reactive, directives, computeExpression };

export const init = (element: HTMLElement | Document = document): void => {
  const stateDirective = `${DIRECTIVE_PREFIX}state`;
  const componentElements = element.querySelectorAll(`[${stateDirective}]`);
  // Filter out uninit scopes only
  const uninitializedComponents = [...componentElements].filter(
    (el) => getElementCustomProp(el as HTMLElement, 'component') === undefined
  );

  for (const el of uninitializedComponents) {
    const stateExpression = el.getAttribute(stateDirective);
    const state = computeExpression(`${stateExpression || '{}'}`, el as HTMLElement, true)({});
    const currentComponent = component(state);
    currentComponent.mount(el as HTMLElement);
  }
};
