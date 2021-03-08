import { DirectiveProps } from '../../models/structs';

import { getElementCustomProp, setElementCustomProp } from '../utils/elementCustomProp';

export const onDirective = ({ el, parts, data, state }: DirectiveProps) => {
  const options: Record<string, boolean> = {};
  const globalScopeEventProps = ['outside', 'global'];
  const eventProps = parts.slice(2);

  if (getElementCustomProp(el, `__on_${parts[1]}_registered`)) return;

  const target = globalScopeEventProps.some((prop) => String(eventProps).includes(prop))
    ? window
    : el;

  const handler = (event: Event) => {
    if (event instanceof KeyboardEvent && /\d/gim.test(String(eventProps))) {
      const whitelistedKeycodes = [];
      for (const eventProp of eventProps) {
        // @ts-expect-error
        if (!isNaN(eventProp)) {
          whitelistedKeycodes.push(Number(eventProp));
        }
      }
      if (!whitelistedKeycodes.includes(event.keyCode)) return;
    }

    // Parse event modifiers based on directive prop
    if (eventProps.includes('prevent')) event.preventDefault();
    if (eventProps.includes('stop')) event.stopPropagation();
    if (eventProps.includes('self')) {
      if (event.target !== el) return;
    }
    if (eventProps.includes('outside')) {
      if (el.contains(event.target as Node)) return;
      if (el.offsetWidth < 1 && el.offsetHeight < 1) return;
    }

    data.compute(state, event);
  };

  options.once = eventProps.includes('once');
  options.passive = eventProps.includes('passive');

  target.addEventListener(parts[1], handler, options);

  setElementCustomProp(el, `__on_${parts[1]}_registered`, true);
};
