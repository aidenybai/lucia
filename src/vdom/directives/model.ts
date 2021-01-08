import { DirectiveProps, DirectiveData, State } from '../../models/structs';

import compute from '../utils/computeExpression';

export const inputCallback = (
  el: HTMLInputElement,
  hydratedValue: unknown,
  data: DirectiveData,
  state: State
) => {
  const isNumber = typeof hydratedValue === 'number' && !isNaN(el.value as any);
  const isBoolean =
    typeof hydratedValue === 'boolean' && (el.value === 'true' || el.value === 'false');
  const isNullish =
    (hydratedValue === null || hydratedValue === undefined) &&
    (el.value === 'null' || el.value === 'undefined');

  // Perform type coercion
  let payload;
  if (isNumber) {
    payload = `Number('${el.value}').toPrecision()`;
  } else if (isBoolean) {
    payload = `Boolean('${el.value}')`;
  } else if (isNullish) {
    if (el.value === 'null') payload = null;
    else payload = undefined;
  } else {
    payload = `'${el.value}'`;
  }

  compute(`${data.value} = ${payload}`, { $el: el }, false)(state);

  return payload;
};

export const modelDirective = ({ el: awaitingTypecastEl, data, state }: DirectiveProps) => {
  const el = awaitingTypecastEl as HTMLInputElement;
  const hydratedValue = data.compute(state);
  if (el.value !== hydratedValue) {
    el.value = hydratedValue;
  }
  el.onchange = () => inputCallback(el, hydratedValue, data, state);
};
