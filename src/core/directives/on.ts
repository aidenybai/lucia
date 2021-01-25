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
    if (eventProp === 'away') {
      if (el.contains($event.target as Node)) return;
      if (el.offsetWidth < 1 && el.offsetHeight < 1) return;
    }

    data.compute(state);
  };

  options.once = eventProp === 'once';
  options.passive = eventProp === 'passive';

  (eventProp === 'away' ? document : el).addEventListener(eventName, handler, options);

  // @ts-ignore
  el.__l_on_registered = handler;
};
