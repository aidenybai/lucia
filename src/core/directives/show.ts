import { DirectiveProps } from '../../models/structs';

export const showDirective = ({ el, data, state }: DirectiveProps) => {
  el.style.display = data.compute(state) ? '' : 'none';
  if (el.style.length === 0) el.removeAttribute('style');
};
