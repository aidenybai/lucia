import { DirectiveProps } from '../../models/structs';

export const ifDirective = ({ el, data, app }: DirectiveProps) => {
  const out = data.compute(app.state);

  if (out) {
    el.style.removeProperty('display');
  } else {
    el.style.display = 'none';
  }
};
