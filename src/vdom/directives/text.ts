import { DirectiveProps } from '../../models/structs';

export const textDirective = ({ el, data, state }: DirectiveProps) => {
  const key = data.value.replace(/(;)/gim, '');
  if (key in state) el.textContent = String(state[key]);
  else el.textContent = data.compute(state) ?? data.value;
};
