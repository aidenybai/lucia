import { DirectiveProps } from '../../models/structs';
import { semicolonCaptureRE } from '../utils/patterns';

export const ifDirective = ({ el, name, data, state }: DirectiveProps) => {
  // Handle naked key in expression case
  const modifier = name.split(':')[1];
  const key = data.value.replace(semicolonCaptureRE(), '');
  let hydratedConditional = true;

  if (key in state) hydratedConditional = !!state[key];
  else hydratedConditional = !!data.compute(state);

  if (modifier === 'hidden') el.hidden = !hydratedConditional;
  // @ts-ignore
  else el.style.display = hydratedConditional === false ? 'none' : null;
};
