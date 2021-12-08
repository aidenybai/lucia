import component from './component';
import { COMPONENT_FLAG, DIRECTIVE_PREFIX } from '@models/generics';

export { component };

/**
 * Initialize components defined in HTML with `l-state`
 * @param {HTMLElement|Document} element - Root element to find uninitialized components
 */
export const init = (element: HTMLElement | Document = document): void => {
  const stateDirective = `${DIRECTIVE_PREFIX}state`;
  const componentElements = element.querySelectorAll<HTMLElement>(`[${stateDirective}]`);
  const uninitializedComponents = [...componentElements].filter((el) => !el[COMPONENT_FLAG]);

  uninitializedComponents.forEach((uninitializedComponent) => {
    const stateExpression = uninitializedComponent.getAttribute(stateDirective);
    const state = new Function(`return ${stateExpression}`)() || {};
    const currentComponent = component(state);

    currentComponent.mount(uninitializedComponent);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  console.log(
    '💖 Support Lucia: https://github.com/aidenybai/lucia?sponsor=1\nℹ️ Want to get rid of this message? Use the production build.',
  );

  init();

  document.querySelectorAll(`[${DIRECTIVE_PREFIX}lazy]`).forEach((el) => {
    el.removeAttribute(`${DIRECTIVE_PREFIX}lazy`);
  });
});
