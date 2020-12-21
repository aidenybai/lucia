import { DirectiveProps } from '../../models/structs';

export const textDirective = ({ el, data, app }: DirectiveProps) => {
  el.textContent = data.compute(app.state);
};
