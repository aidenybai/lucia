import { args } from './args';

export const modelDirective = ({ el, value, view }: args) => {
  el.value = view[value];

  const model = () => {
    const isNumber = typeof view[value] === 'number' && !isNaN(el.value);
    const isBoolean =
      typeof view[value] === 'boolean' && (el.value === 'true' || el.value === 'false');
    const isNullish =
      (view[value] === null || view[value] === undefined) &&
      (el.value === 'null' || el.value === 'undefined');

    // Perform type coercion
    if (isNumber) {
      view[value] = Number(el.value).toPrecision();
    } else if (isBoolean) {
      view[value] = Boolean(el.value);
    } else if (isNullish) {
      if (el.value === 'null') view[value] = null;
      else view[value] = undefined;
    } else {
      view[value] = el.value;
    }
  };

  el.oninput = model; // Render init
  model();
};
