import compute from '../helpers/compute';

export const onDirective = (
  el: HTMLElement | any,
  name: string,
  value: string | any,
  view: Record<string, any>
) => {
  const eventTokens = name.split('.');
  const eventName = eventTokens[0].split(':')[1];
  const eventProp = eventTokens[1] || null;

  if (eventName === 'effect') {
    compute(value, view);
  } else {
    el[`on${eventName}`] = ($event: Event) => {
      if (eventProp === 'prevent') $event.preventDefault();
      if (eventProp === 'stop') $event.stopPropagation();

      compute(value, view);
    };
  }
};
