import { bindDirective } from './bind';
import { joinDirective } from './join';
import { htmlDirective } from './html';
import { ifDirective } from './if';
import { modelDirective } from './model';
import { onDirective } from './on';
import { textDirective } from './text';
import { args } from './args';

export const directives: Record<string, Function> = {
  bind: bindDirective,
  join: joinDirective,
  html: htmlDirective,
  if: ifDirective,
  model: modelDirective,
  on: onDirective,
  text: textDirective,
};

export const render = ({ el, name, value, view }: args) => {
  const rootName = name.split(/:|\./)[0];
  directives[rootName]({ el, name, value, view });
};

export default render;
