import compute from '../helpers/compute';
import { directiveArgs } from '../helpers/interfaces';

export const ifDirective = ({ el, value, view }: directiveArgs) => {
  el.hidden = !compute(value, view);
};
