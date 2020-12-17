import { DirectiveProps } from '../../models/structs';

export const ifDirective = ({ el, data, state }: DirectiveProps) => {
  const out = data.run(state);

  if (out) {
    el.style.removeProperty('display');
  } else {
    el.style.display = 'none';
  }
};
