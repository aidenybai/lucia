import component from './component';
import { COMPONENT_FLAG, DIRECTIVE_PREFIX } from '@models/generics';

/**
 * Initialize components defined in HTML with `l-state`
 * @param {HTMLElement|Document} element - Root element to find uninitialized components
 */
const init = (element: HTMLElement | Document = document): void => {
  const stateDirective = `${DIRECTIVE_PREFIX}state`;
  const componentElements = element.querySelectorAll<HTMLElement>(`[${stateDirective}]`);
  const uninitializedComponents = [...componentElements].filter(
    (el) => el[COMPONENT_FLAG] === undefined,
  );

  uninitializedComponents.forEach((uninitializedComponent) => {
    const stateExpression = uninitializedComponent.getAttribute(stateDirective);
    const state = new Function(`return ${stateExpression}`)() || {};
    const currentComponent = component(state);

    currentComponent.mount(uninitializedComponent);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init());
}

export { init, component };
