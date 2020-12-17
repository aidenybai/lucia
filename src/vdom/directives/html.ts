import { DirectiveProps } from '../../models/structs';

import { createApp } from '../../App';

export const htmlDirective = ({ el, data, state }: DirectiveProps) => {
  // Create shallow nested Lucia app
  const app = createApp({ ...state });
  app.mount(el, true);

  el.innerHTML = data.run(state);
};
