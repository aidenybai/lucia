import { bindDirective } from './bind';
import { joinDirective } from './join';
import { htmlDirective } from './html';
import { ifDirective } from './if';
import { modelDirective } from './model';
import { onDirective } from './on';
import { textDirective } from './text';

export default ({
  el,
  name,
  value,
  view,
}: {
  el: Element | null;
  name: string;
  value: string;
  view: ProxyConstructor | any;
}) => {
  const directives: Record<string, Function> = {
    bind: bindDirective,
    join: joinDirective,
    html: htmlDirective,
    if: ifDirective,
    model: modelDirective,
    on: onDirective,
    text: textDirective,
  };

  const rootName = name.split(':')[0];
  directives[rootName]({ el, name, value, view });
};
