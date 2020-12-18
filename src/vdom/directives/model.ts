import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';

export const modelDirective = ({ el: awaitingTypecastEl, data, state }: DirectiveProps) => {
  const el = awaitingTypecastEl as HTMLInputElement;
  const out = compute(data.compute(), { $el: el })(state);
  if (el.value !== out) {
    el.value = out;
  }
  el.oninput = () => {
    const isNumber = typeof out === 'number' && !isNaN(el.value as any);
    const isBoolean = typeof out === 'boolean' && (el.value === 'true' || el.value === 'false');
    const isNullish =
      (out === null || out === undefined) && (el.value === 'null' || el.value === 'undefined');

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
  };
};
