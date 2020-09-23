import { bindDirective } from './bind';
import { joinDirective } from './join';
import { htmlDirective } from './html';
import { ifDirective } from './if';
import { modelDirective } from './model';
import { onDirective } from './on';

export default ({
  directive,
  el,
  name,
  value,
  data,
}: {
  directive: string;
  el: HTMLElement | any;
  name: string;
  value: string | any;
  data: ProxyConstructor | any;
}) => {
  if (directive.startsWith('bind')) {
    bindDirective(el, name, value, data);
  }

  if (directive.startsWith('join')) {
    joinDirective(el, value, data);
  }

  if (directive.startsWith('html')) {
    htmlDirective(el, value, data);
  }

  if (directive.startsWith('if')) {
    ifDirective(el, value, data);
  }

  if (directive.startsWith('model')) {
    modelDirective(el, value, data);
  }

  if (directive.startsWith('on')) {
    onDirective(el, name, value, data);
  }
};
