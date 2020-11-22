import compute from '../utils/compute';
import { DirectiveArgs } from './IDirectiveArgs';

export const onDirective = ({ el, name, value, view }: DirectiveArgs) => {
  const eventTokens = name.split('.');
  const eventName = eventTokens[0].split(':')[1];
  const eventProp = eventTokens[1] || null;

  el[`on${eventName}`] = ($event: Event) => {
    // Parse event modifiers based on directive prop
    if (eventProp === 'prevent') $event.preventDefault();
    if (eventProp === 'stop') $event.stopPropagation();

    compute(value, { $view: view, $el: el }, false);
  };
};
