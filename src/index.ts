// Exports wrapped in Lucia namespace
import component from './component';
import compile from './core/compile';
import { directives } from './core/directive';
import reactive from './core/reactive';
import render from './core/render';
import computeExpression from './core/utils/computeExpression';
import { getElementCustomProp } from './core/utils/elementCustomProp';
import { DIRECTIVE_PREFIX } from './models/generics';

export { component, compile, render, reactive, directives, computeExpression };

// This is generally used for browser builds only, but it can be accessed in bundling environments
export const init = (element: HTMLElement | Document = document): void => {
  const stateDirective = `${DIRECTIVE_PREFIX}state`;
  const componentElements = element.querySelectorAll(`[${stateDirective}]`);
  const uninitializedComponents = [...componentElements].filter(
    (el) => getElementCustomProp(el as HTMLElement, 'component') === undefined
  );

  uninitializedComponents.forEach((uninitializedComponent) => {
    const stateExpression = uninitializedComponent.getAttribute(stateDirective);
    const state = computeExpression(
      `${stateExpression || '{}'}`,
      uninitializedComponent as HTMLElement,
      true
    )({});
    const currentComponent = component(state);
    currentComponent.mount(uninitializedComponent as HTMLElement);
  });
};
