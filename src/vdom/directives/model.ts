import { DirectiveProps } from '../../models/structs';

import compute from '../utils/compute';

export const modelDirective = ({ el: awaitingTypecastEl, data, app }: DirectiveProps) => {
  const el = awaitingTypecastEl as HTMLInputElement;
  const hydratedValue = compute(data.compute(), { $el: el })(app.state);
  if (el.value !== hydratedValue) {
    el.value = hydratedValue;
  }
  el.oninput = () => {
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

    compute(`${data.value} = ${payload}`, { $el: el }, false)(app.state);
  };
};
