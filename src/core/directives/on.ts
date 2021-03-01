import { DirectiveProps } from '../../models/structs';
import { rawDirectiveSplitRE } from '../utils/patterns';

import { getElementCustomProp, setElementCustomProp } from '../utils/elementCustomProp';

export const onDirective = ({ el, name, data, state }: DirectiveProps) => {
  const options: Record<string, boolean> = {};
  const globalScopeEventProps = ['outside', 'global'];

  const [, eventName, ...eventProps] = name.split(rawDirectiveSplitRE());
  if (getElementCustomProp(el, `__l_on_${eventName}_registered`)) return;

  const target = globalScopeEventProps.some((prop) => String(eventProps).includes(prop))
    ? window
    : el;

  const handler = (event: Event) => {
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

  target.addEventListener(eventName, handler, options);

  setElementCustomProp(el, `__l_on_${eventName}_registered`, true);
};
