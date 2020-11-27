import compute from '../utils/compute';
import { DirectiveArgs } from './IDirectiveArgs';

export const textDirective = ({ el, value, view }: DirectiveArgs) => {
  try {
    el.innerHTML = compute(value, { $view: view, $el: el });
  } catch {
    el.innerHTML = value;
  }
};
