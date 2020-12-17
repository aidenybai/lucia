import { DirectiveProps } from '../../models/structs';

export const textDirective = ({ el, data, state }: DirectiveProps) => {
  el.textContent = data.run(state);
};
