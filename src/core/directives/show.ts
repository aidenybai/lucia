import { DirectiveProps } from '@models/structs';

export const showDirective = ({ el, data, state }: DirectiveProps): void => {
  const ret = data.compute(state);
  /* istanbul ignore next */
  if (ret !== el.style.display) el.style.display = ret ? '' : 'none';
  if (el.style.length === 0) el.removeAttribute('style');
};
