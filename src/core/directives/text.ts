import { DirectiveProps } from '../../models/structs';
import { semicolonCaptureRE } from '../utils/patterns';

export const textDirective = ({ el, data, state }: DirectiveProps) => {
  // Handle naked key in expression case
  const key = data.value.replace(semicolonCaptureRE(), '');
  if (key in state) el.textContent = String(state[key]);
  else el.textContent = data.compute(state) ?? data.value;
};
