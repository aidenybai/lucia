// Exports wrapped in Lucia namespace
import { DIRECTIVE_PREFIX } from './models/generics';
import { createApp } from './App';

import h from './vdom/h';
import patch from './vdom/patch';
import compile from './vdom/compile';
import reactive from './vdom/reactive';
import { directives, renderDirective } from './vdom/directive';

const stateDirective = `${DIRECTIVE_PREFIX}state`;
const hrefDirective = `${DIRECTIVE_PREFIX}href`;

export { createApp, h, compile, patch, reactive, directives, renderDirective };

export const initHotswaps = (element: HTMLElement | Document = document): void => {
  const searchAndAttachHotswaps = () => {
    const elements = [...element.querySelectorAll(`[${hrefDirective}]`)];
    elements
      // @ts-ignore
      .map((el) => {
        el.addEventListener('click', () => {
          hotswap(el.getAttribute(hrefDirective)!);
        });
      });
  };

  const hotswap = async (link: string) => {
    const response = await fetch(link);

    if (!response.ok) return;

    const html = await response.text();

    window.history.pushState({ id: window.history.length }, document.title, link);
    document.body.innerHTML = html;

    searchAndAttachHotswaps();
  };

  window.onpopstate = (event: PopStateEvent) => {
    // @ts-ignore
    const { pathname } = new URL(event.path[0].document.URL);

    hotswap(window.location.href);

    // Hacky way of getting this to work
    location.reload();
  };

  searchAndAttachHotswaps();
};

export const init = (element: HTMLElement | Document = document): void => {
  const elements = [...element.querySelectorAll(`[${stateDirective}]`)];

  elements
    // @ts-ignore
    .filter((el) => el.__l === undefined) // Filter out uninit scopes only
    .map((el) => {
      const expression = el.getAttribute(stateDirective);

      try {
        const state = new Function(`return ${expression}`)();
        const app = createApp(state || {});
        app.mount(el as HTMLElement);
      } catch (err) {
        console.warn(`Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`, el);
      }
    });
};

// Adapted from Alpine.js
export const listen = (
  callback: Function,
  element: HTMLElement | Document = document,
  config?: Record<string, boolean>
): void => {
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
  observer.observe(
    element,
    config || {
      childList: true,
      attributes: true,
      subtree: true,
    }
  );
};
