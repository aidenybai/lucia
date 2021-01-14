import { DirectiveProps } from '../../models/structs';

export const onDirective = ({ el, name, data, state }: DirectiveProps) => {
  const options: Record<string, boolean> = {};
  // @ts-ignore
  if (el.__l_on_registered) return;

  const [directiveAndEventName, prop] = name.split('.');
  const eventName = directiveAndEventName.split(':')[1];
  const eventProp = prop || null;

  const handler = ($event: Event) => {
    // Parse event modifiers based on directive prop
    if (eventProp === 'prevent') $event.preventDefault();
    if (eventProp === 'stop') $event.stopPropagation();

    data.compute(state);
  };

  options.once = eventProp === 'once';
  options.passive = eventProp === 'passive';

  el.addEventListener(eventName, handler, options);

  // @ts-ignore
  el.__l_on_registered = handler;
};
