// Exports wrapped in Lucia namespace
import { DIRECTIVE_PREFIX } from './models/generics';
import { Directives } from './models/structs';
import component from './component';

import render from './core/render';
import compile from './core/compile';
import reactive from './core/reactive';
import { directives } from './core/directive';
import { getElementCustomProp } from './core/utils/elementCustomProp';
import computeExpression from './core/utils/computeExpression';

export { component, compile, render, reactive, directives, computeExpression };

export const init = (
  element: HTMLElement | Document = document,
  directives: Directives = {}
): void => {
  const stateDirective = `${DIRECTIVE_PREFIX}state`;
  const initDirective = `${DIRECTIVE_PREFIX}init`;
  const watchDirective = `${DIRECTIVE_PREFIX}watch`;

  const componentElements = element.querySelectorAll(`[${stateDirective}]`);
  // Filter out uninit scopes only
  const uninitializedComponents = [...componentElements].filter(
    (el) => getElementCustomProp(el as HTMLElement, '__l') === undefined
  );

  for (const el of uninitializedComponents) {
    const stateExpression = el.getAttribute(stateDirective);
    const initExpression = el.getAttribute(initDirective);
    const watchExpression = el.getAttribute(watchDirective);

    // Parse state from state expression
    const state = computeExpression(`${stateExpression || '{}'}`, el as HTMLElement, true)({});
    const watchers = computeExpression(`${watchExpression || '{}'}`, el as HTMLElement, true)({});
    const currentComponent = component(state);
    for (const [directiveName, directiveCallback] of Object.entries(directives)) {
      currentComponent.directive(directiveName, directiveCallback);
    }
    for (const [property, watcher] of Object.entries(watchers)) {
      currentComponent.watch(property, watcher as Function);
    }
    currentComponent.mount(el as HTMLElement);

    const init = initExpression
      ? computeExpression(`${initExpression}`, el as HTMLElement, true)
      : undefined;
    if (init) init(state);
  }
};
