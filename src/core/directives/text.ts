import { DirectiveProps } from '@models/structs';

export const textDirective = ({ el, data, state }: DirectiveProps): void => {
  const ret = data.compute(state) ?? data.value;
  /* istanbul ignore next */
  if (ret !== el.textContent) {
    el.textContent = ret;
  }
};
