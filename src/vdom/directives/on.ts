import { DirectiveProps } from '../../models/structs';

export const onDirective = ({ el, name, data, app }: DirectiveProps) => {
  const [directiveAndEventName, prop] = name.split('.');
  const eventName = directiveAndEventName.split(':')[1];
  const eventProp = prop || null;

  el[`on${eventName}`] = ($event: Event) => {
    console.log('hit!');
    // Parse event modifiers based on directive prop
    if (eventProp === 'prevent') $event.preventDefault();
    if (eventProp === 'stop') $event.stopPropagation();

    data.compute(app.state);
  };
};
