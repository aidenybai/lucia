import { DirectiveProps } from '../../models/structs';

export const ifDirective = ({ el, data, state }: DirectiveProps) => {
  const out = data.compute(state);

  if (out) {
    el.style.removeProperty('display');
  } else {
    el.style.display = 'none';
  }
};
