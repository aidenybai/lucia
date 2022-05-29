import { MODEL_REGISTERED_FLAG } from '@models/generics';
import { DirectiveData, DirectiveProps, State } from '@models/structs';
import computeExpression from '@utils/computeExpression';

export const inputCallback = (
  el: HTMLInputElement,
  hydratedValue: unknown,
  data: DirectiveData,
  state: State,
): number | string | undefined | null | boolean => {
  /* istanbul ignore next */
  if (el.type === 'checkbox') {
    /* istanbul ignore next */
    el.value = String(el.checked);
  }

  // @ts-expect-error: el.value can be any type, but isNaN only accepts number
  const isNumber = typeof hydratedValue === 'number' && !isNaN(el.value);
  const isBoolean =
    typeof hydratedValue === 'boolean' && (el.value === 'true' || el.value === 'false');
  const isNullish =
    (hydratedValue === null || hydratedValue === undefined) &&
    (el.value === 'null' || el.value === 'undefined');

  // Perform type coercion
  let payload;
  if (isNumber) {
    payload = Number(el.value);
  } else if (isBoolean) {
    payload = el.value === 'true';
  } else if (isNullish) {
    if (el.value === 'null') payload = null;
    else payload = undefined;
  } else {
    payload = String(el.value);
  }

  /* istanbul ignore next */
  if (state[data.value]) {
    state[data.value] = payload;
  } else {
    payload = typeof payload === 'string' ? `decodeURI(\`${encodeURI(payload)}\`)` : payload;
    computeExpression(`(${data.value} = ${payload})`, el, true)(state);
  }

  return payload;
};

/* istanbul ignore next */
export const modelDirective = ({
  el: awaitingTypecastEl,
  parts,
  data,
  state,
}: DirectiveProps): void => {
  const el = awaitingTypecastEl as HTMLInputElement;
  const hydratedValue = state[data.value] ?? computeExpression(data.value, el, true)(state);
  const accessor = el.type === 'checkbox' ? 'checked' : 'value';
  if (el[accessor] !== String(hydratedValue)) {
    el[accessor] = hydratedValue as never;
  }

  if (!el[MODEL_REGISTERED_FLAG]) {
    const callback = () => inputCallback(el, hydratedValue, data, state);

    el.addEventListener(parts[1] === 'debounce' ? 'change' : 'input', callback);

    el[MODEL_REGISTERED_FLAG] = true;
  }
};
