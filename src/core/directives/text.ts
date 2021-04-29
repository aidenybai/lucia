import { DirectiveProps } from '../../models/structs';

export const textDirective = ({ el, parts, data, state }: DirectiveProps): void => {
  const ret = data.compute(state) ?? data.value;
  const prop = parts[1] === 'perf' ? 'textContent' : 'innerText';
  if (ret !== el[prop]) {
    el[prop] = ret;
  }
};
