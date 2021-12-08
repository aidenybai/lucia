import { DirectiveProps, KeyedEvent } from '@models/structs';

export const onDirective = ({ el, parts, data, state }: DirectiveProps): void => {
  const options: Record<string, boolean> = {};
  const globalScopeEventProps = ['outside', 'global'];
  const eventProps = parts.slice(2);
  const EVENT_REGISTERED_FLAG = `__on_${parts[1]}_registered`;

  if (el[EVENT_REGISTERED_FLAG]) return;

  const target = globalScopeEventProps.some((prop) => String(eventProps).includes(prop))
    ? window
    : el;

  /* istanbul ignore next */
  const handler = (event: Event) => {
    if (eventProps.length > 0) {
      if (event instanceof KeyboardEvent && /\d/gim.test(String(eventProps))) {
        const whitelistedKeycodes: number[] = [];
        eventProps.forEach((eventProp) => {
          // @ts-expect-error: eventProp can be a string, but isNaN only accepts number
          if (!isNaN(eventProp)) {
            whitelistedKeycodes.push(Number(eventProp));
          }
        });
        if (!whitelistedKeycodes.includes(event.keyCode)) return;
      }

      // Parse event modifiers based on directive prop
      if (eventProps.includes('prevent')) event.preventDefault();
      if (eventProps.includes('stop')) event.stopPropagation();
      if (eventProps.includes('self')) {
        if (event.target !== el) return;
      }
      /* istanbul ignore next */
      if (eventProps.includes('outside')) {
        if (el.contains(event.target as Node)) return;
        if (el.offsetWidth < 1 && el.offsetHeight < 1) return;
      }

      if (eventProps.includes('enter') || eventProps.includes('meta')) {
        if ((event as KeyboardEvent).key === 'Enter') {
          data.compute(state, event);
        }
      }

      if (
        (eventProps.includes('ctrl') && (event as KeyedEvent).ctrlKey) ||
        (eventProps.includes('alt') && (event as KeyedEvent).altKey) ||
        (eventProps.includes('shift') && (event as KeyedEvent).shiftKey) ||
        (eventProps.includes('left') && 'button' in event && (event as MouseEvent).button === 0) ||
        (eventProps.includes('middle') &&
          'button' in event &&
          (event as MouseEvent).button === 1) ||
        (eventProps.includes('right') && 'button' in event && (event as MouseEvent).button === 2)
      ) {
        data.compute(state, event);
      }
    } else {
      data.compute(state, event);
    }
  };

  options.once = eventProps.includes('once');
  options.passive = eventProps.includes('passive');

  target.addEventListener(parts[1], handler, options);

  el[EVENT_REGISTERED_FLAG] = true;
};
