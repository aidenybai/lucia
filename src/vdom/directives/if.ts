import { DirectiveProps } from '../../models/structs';

export const ifDirective = ({ el, data, app }: DirectiveProps) => {
  const hydratedConditional = data.compute(app.state);

  if (hydratedConditional) {
    el.style.removeProperty('display');
  } else {
    el.style.display = 'none';
  }
};
