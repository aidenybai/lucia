import compute from '../utils/compute';
import { DirectiveArgs } from './IDirectiveArgs';

export const modelDirective = ({ el, value, view }: DirectiveArgs) => {
  const out = compute(value, { $view: view, $el: el });
  if (el.value !== out) {
    el.value = out;
  }
  el.oninput = () => {
    const isNumber = typeof out === 'number' && !isNaN(el.value);
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

    compute(`${value} = ${payload}`, { $view: view, $el: el }, false);
  };
};
