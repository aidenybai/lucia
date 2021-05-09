// Exports wrapped in Lucia namespace
import component from './component';
import { COMPONENT_FLAG, DIRECTIVE_PREFIX } from '@models/generics';

// This is generally used for browser builds only, but it can be accessed in bundling environments
const init = (element: HTMLElement | Document = document): void => {
  const stateDirective = `${DIRECTIVE_PREFIX}state`;
  const tagDirective = `${DIRECTIVE_PREFIX}tag`;
  const componentElements = element.querySelectorAll(`[${stateDirective}], [${tagDirective}]`);
  const uninitializedComponents = [...componentElements].filter(
    (el) => (el as HTMLElement)[COMPONENT_FLAG] === undefined
  );
  let needsReInit = false;

  uninitializedComponents.forEach((uninitializedComponent) => {
    if (uninitializedComponent.hasAttribute(tagDirective)) {
      const tag = uninitializedComponent.getAttribute(tagDirective)!;
      const customComponents = [...element.querySelectorAll(tag)];
      // @ts-expect-error: this is a template element
      const realElement = uninitializedComponent.content.firstElementChild;
      customComponents.forEach((customComponent) => {
        customComponent.replaceWith(realElement.cloneNode(true));
      });
      if (customComponents.length > 0) needsReInit = true;
    } else {
      const stateExpression = uninitializedComponent.getAttribute(stateDirective);
      const state = new Function(`return ${stateExpression}`)() || {};
      const currentComponent = component(state);

      currentComponent.mount(uninitializedComponent as HTMLElement);
    }
  });

  if (needsReInit) init(element);
};

export { init, component };
