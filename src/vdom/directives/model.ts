import { DirectiveProps, DirectiveData, DirectiveApp } from '../../models/structs';

import compute from '../utils/compute';

export const inputCallback = (
  el: HTMLInputElement,
  hydratedValue: unknown,
  data: DirectiveData,
  app: DirectiveApp
) => {
  const isNumber = typeof hydratedValue === 'number' && !isNaN(el.value as any);
  const isBoolean =
    typeof hydratedValue === 'boolean' && (el.value === 'true' || el.value === 'false');
  const isNullish =
    (hydratedValue === null || hydratedValue === undefined) &&
    (el.value === 'null' || el.value === 'undefined');

  // Perform type coercion
  const payload = isNumber
    ? `Number('${el.value}').toPrecision()`
    : isBoolean
    ? `Boolean('${el.value}')`
    : isNullish && el.value === 'null'
    ? null
    : isNullish
    ? undefined
    : `${el.value}`;

  compute(`${data.value} = ${payload}`, { $el: el }, false)(app.state);

  return payload;
};

export const modelDirective = ({ el: awaitingTypecastEl, data, app }: DirectiveProps) => {
  const el = awaitingTypecastEl as HTMLInputElement;
  const hydratedValue = data.compute(app.state);
  if (el.value !== hydratedValue) {
    el.value = hydratedValue;
  }
  el.oninput = () => inputCallback(el, hydratedValue, data, app);
};
