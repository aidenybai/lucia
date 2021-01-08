import { DirectiveProps } from '../../models/structs';

import { createApp } from '../../App';

export const htmlDirective = ({ el, data, state }: DirectiveProps) => {
  el.innerHTML = data.compute(state) ?? data.value;

  createApp({ ...state }).mount(el);
};
