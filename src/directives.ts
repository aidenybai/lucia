import { bindDirective } from './directives/bind';
import { joinDirective } from './directives/join';
import { htmlDirective } from './directives/html';
import { ifDirective } from './directives/if';
import { modelDirective } from './directives/model';
import { onDirective } from './directives/on';
import { textDirective } from './directives/text';
import { watchDirective } from './directives/watch';

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
    watch: watchDirective,
  };

  const rootName = name.split(':')[0];
  directives[rootName](el, name, value, view);
};
