import { DirectiveProps } from '../../models/structs';

export const ifDirective = ({ el, name, data, app }: DirectiveProps) => {
  const modifier = name.split(':')[1];
  const hydratedConditional = !!data.compute(app.state);

  if (modifier === 'hidden') el.hidden = !hydratedConditional;
  // @ts-ignore
  else el.style.display = hydratedConditional === false ? 'none' : null;
};
