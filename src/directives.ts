import { bindDirective } from './directives/bind';
import { joinDirective } from './directives/join';
import { htmlDirective } from './directives/html';
import { ifDirective } from './directives/if';
import { modelDirective } from './directives/model';
import { onDirective } from './directives/on';

export default ({
  el,
  name,
  value,
  view,
}: {
  el: HTMLElement | any;
  name: string;
  value: string | any;
  view: ProxyConstructor | any;
}) => {
  const directives: Record<string, Function> = {
    bind: bindDirective,
    join: joinDirective,
    html: htmlDirective,
    if: ifDirective,
    model: modelDirective,
    on: onDirective,
  };

  const rootName = name.split(':')[0];
  directives[rootName](el, name, value, view);
};
