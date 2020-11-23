import { DirectiveArgs } from './IDirectiveArgs';

export const modelDirective = ({ el, value, view }: DirectiveArgs) => {
  el.value = view[value];
  el.oninput = () => {
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
};
