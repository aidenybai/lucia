import { DirectiveProps } from '../../models/structs';

export const textDirective = ({ el, data, state }: DirectiveProps): void => {
  const ret = data.compute(state) ?? data.value;
  if (ret !== el.innerText) {
    el.innerText = ret;
  }
};
