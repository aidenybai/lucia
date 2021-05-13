// Exports wrapped in Lucia namespace
import component from './component';
import { COMPONENT_FLAG, DIRECTIVE_PREFIX } from '@models/generics';

// This is generally used for browser builds only, but it can be accessed in bundling environments
const init = (element: HTMLElement | Document = document): void => {
  const stateDirective = `${DIRECTIVE_PREFIX}state`;
  const componentElements = element.querySelectorAll<HTMLElement>(`[${stateDirective}]`);
  const uninitializedComponents = [...componentElements].filter(
    (el) => el[COMPONENT_FLAG] === undefined
  );

  uninitializedComponents.forEach((uninitializedComponent) => {
    const stateExpression = uninitializedComponent.getAttribute(stateDirective);
    const state = () => new Function(`return ${stateExpression}`)() || {};
    const currentComponent = component(state);

    currentComponent.init(uninitializedComponent);
  });
};

export { init, component };
