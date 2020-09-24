import { bindDirective } from './bind';
import { joinDirective } from './join';
import { htmlDirective } from './html';
import { ifDirective } from './if';
import { modelDirective } from './model';
import { onDirective } from './on';

export default ({
  el,
  name,
  value,
  data,
}: {
  el: HTMLElement | any;
  name: string;
  value: string | any;
  data: ProxyConstructor | any;
}) => {
  if (name.startsWith('bind')) {
    bindDirective(el, name, value, data);
  }

  if (name.startsWith('join')) {
    joinDirective(el, value, data);
  }

  if (name.startsWith('html')) {
    htmlDirective(el, value, data);
  }

  if (name.startsWith('if')) {
    ifDirective(el, value, data);
  }

  if (name.startsWith('model')) {
    modelDirective(el, value, data);
  }

  if (name.startsWith('on')) {
    onDirective(el, name, value, data);
  }
};
