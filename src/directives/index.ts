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
  view,
}: {
  el: HTMLElement | any;
  name: string;
  value: string | any;
  view: ProxyConstructor | any;
}) => {
  if (name.startsWith('bind')) {
    bindDirective(el, name, value, view);
  }

  if (name.startsWith('join')) {
    joinDirective(el, value, view);
  }

  if (name.startsWith('html')) {
    htmlDirective(el, value, view);
  }

  if (name.startsWith('if')) {
    ifDirective(el, value, view);
  }

  if (name.startsWith('model')) {
    modelDirective(el, value, view);
  }

  if (name.startsWith('on')) {
    onDirective(el, name, value, view);
  }
};
