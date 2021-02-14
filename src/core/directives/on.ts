import { DirectiveProps } from '../../models/structs';

import { getElementCustomProp, setElementCustomProp } from '../utils/elementCustomProp';

export const onDirective = ({ el, name, data, state }: DirectiveProps) => {
  const options: Record<string, boolean> = {};
  const globalScopeEventProps = ['outside', 'global'];

  if (getElementCustomProp(el, '__l_on_registered')) return;

  const [directiveAndEventName, prop] = name.split('.');
  const eventName = directiveAndEventName.split(':')[1];
  const eventProp = prop || null;
  const target = globalScopeEventProps.includes(String(eventProp)) ? document : el;

  const handler = ($event: Event) => {
    // Parse event modifiers based on directive prop
    if (eventProp === 'prevent') $event.preventDefault();
    if (eventProp === 'stop') $event.stopPropagation();
    if (eventProp === 'outside') {
      if (el.contains($event.target as Node)) return;
      if (el.offsetWidth < 1 && el.offsetHeight < 1) return;
    }

    data.compute(state, $event);
  };

  options.once = eventProp === 'once';
  options.passive = eventProp === 'passive';

  target.addEventListener(eventName, handler, options);

  setElementCustomProp(target as HTMLElement, '__l_on_registered', true);
};
