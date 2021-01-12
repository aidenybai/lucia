// Exports wrapped in Lucia namespace
import { DIRECTIVE_PREFIX } from './models/generics';
import { createApp } from './App';

import patch from './core/patch';
import compile from './core/compile';
import reactive from './core/reactive';
import { directives, renderDirective } from './core/directive';

const stateDirective = `${DIRECTIVE_PREFIX}state`;

export { createApp, compile, patch, reactive, directives, renderDirective };

export const init = (element: HTMLElement | Document = document): void => {
  const elements = element.querySelectorAll(`[${stateDirective}]`);

  elements
    // @ts-ignore
    .filter((el) => el.__l === undefined) // Filter out uninit scopes only
    .map((el: HTMLElement) => {
      const expression = el.getAttribute(stateDirective);

      try {
        // Parse state from state expression
        const state = new Function(`return ${expression}`)();
        const app = createApp(state || {});
        app.mount(el);
      } catch (err) {
        console.warn(`Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`, el);
      }
    });
};

// Adapted from Alpine.js
export const listen = (callback: Function, element: HTMLElement | Document = document): void => {
  const observer = new MutationObserver((mutations) => {
    mutations.map((mut) => {
      // Handle Node creation
      if (mut.addedNodes.length > 0) {
        mut.addedNodes.forEach((node) => {
          // Discard non-element nodes (like line-breaks)
          if (node.nodeType !== 1) return;

          // Discard any changes happening within an existing component.
          if (node.parentElement && node.parentElement.closest(`[${stateDirective}]`)) return;

          // Discard if not a new component scope
          if (!(node as Element).getAttribute(stateDirective)) return;

          callback(node.parentElement as HTMLElement);
        });
        // Handle Node mutation
      } else if (mut.type === 'attributes') {
        // Discard any changes happening within an existing component.
        if (mut.target.parentElement && mut.target.parentElement.closest(`[${stateDirective}]`))
          return;

        callback(mut.target.parentElement as HTMLElement);
      }
    });
  });
  observer.observe(element, {
    childList: true,
    attributes: true,
    subtree: true,
  });
};
