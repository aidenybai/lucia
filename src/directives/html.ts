import compute from '../helpers/compute';
import { directiveArgs } from '../helpers/interfaces';

export const htmlDirective = ({ el, value, view }: directiveArgs) => {
  const out = compute(value, view);

  if (out !== undefined) {
    el.innerHTML = out;
  } else {
    el.innerHTML = value;
  }
};
