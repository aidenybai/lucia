import compute from '../utils/compute';
import { createApp } from '../index';
import { DirectiveArgs } from './IDirectiveArgs';

export const htmlDirective = ({ el, value, view }: DirectiveArgs) => {
  const out = compute(value, { $view: view, $el: el });

  createApp({ ...view }).mount(el);

  if (out !== undefined) {
    el.innerHTML = out;
  } else {
    el.innerHTML = value;
  }
};
