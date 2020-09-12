import { bindDirective } from './bind';
import { forDirective } from './for';
import { htmlDirective } from './html';
import { ifDirective } from './if';
import { modelDirective } from './model';
import { onDirective } from './on';

export default (
  directive: string,
  el: HTMLElement | any,
  attr: string,
  value: string | any,
  data: Function | any
) => {
  if (directive === 'bind') {
    bindDirective(el, attr, value, data);
  }

  if (directive === 'for') {
    forDirective(el, value, data);
  }

  if (directive === 'html') {
    htmlDirective(el, value, data);
  }

  if (directive === 'if') {
    ifDirective(el, value, data);
  }

  if (directive === 'model') {
    modelDirective(el, value, data);
  }

  if (directive === 'on') {
    onDirective(el, attr, value, data);
  }
};