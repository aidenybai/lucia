import { DirectiveProps, DirectiveData, State } from '../../models/structs';

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
    payload = Number(el.value).toPrecision();
  } else if (isBoolean) {
    payload = Boolean(el.value);
  } else if (isNullish) {
    if (el.value === 'null') payload = null;
    else payload = undefined;
  } else {
    payload = String(el.value);
  }

  state[data.value] = payload;

  return payload;
};

export const modelDirective = ({ el: awaitingTypecastEl, name, data, state }: DirectiveProps) => {
  const el = awaitingTypecastEl as HTMLInputElement;
  const hydratedValue = data.compute(state);
  if (el.value !== hydratedValue) {
    el.value = hydratedValue;
  }
  const [, prop] = name.split('.');
  const callback = () => inputCallback(el, hydratedValue, data, state);

  if (prop === 'debounce') el.onchange = callback;
  else el.oninput = callback;
};
