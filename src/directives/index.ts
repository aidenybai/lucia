import { bindDirective } from './bind';
import { joinDirective } from './join';
import { htmlDirective } from './html';
import { ifDirective } from './if';
import { modelDirective } from './model';
import { onDirective } from './on';

export default ({
  directive,
  el,
  attr,
  value,
  data,
}: {
  directive: string;
  el: HTMLElement | any;
  attr: string;
  value: string | any;
  data: ProxyConstructor | any;
}) => {
  if (directive.startsWith('bind')) {
    bindDirective(el, attr, value, data);
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
    onDirective(el, attr, value, data);
  }
};
