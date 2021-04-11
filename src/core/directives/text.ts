import { DirectiveProps } from '../../models/structs';

export const textDirective = ({ el, data, state }: DirectiveProps): void => {
  el.textContent = data.compute(state) ?? data.value;
};
