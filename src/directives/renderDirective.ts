import { bindDirective } from './bind';
import { joinDirective } from './join';
import { htmlDirective } from './html';
import { ifDirective } from './if';
import { modelDirective } from './model';
import { onDirective } from './on';
import { textDirective } from './text';
import { DirectiveArgs } from './IDirectiveArgs';

export const directives: Record<string, Function> = {
  bind: bindDirective,
  join: joinDirective,
  html: htmlDirective,
  if: ifDirective,
  model: modelDirective,
  on: onDirective,
  text: textDirective,
};

export const renderDirective = ({ el, name, value, view }: DirectiveArgs) => {
  const rootName = name.split(/:|\./)[0]; // Split directive:modifier.property
  directives[rootName]({ el, name, value, view });
};

export default renderDirective;
