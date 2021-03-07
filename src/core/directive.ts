import { Directives, DirectiveProps } from '../models/structs';

import { bindDirective } from './directives/bind';
import { htmlDirective } from './directives/html';
import { modelDirective } from './directives/model';
import { showDirective } from './directives/show';
import { onDirective } from './directives/on';
import { textDirective } from './directives/text';
import { forDirective } from './directives/for';

export const directives: Directives = {
  BIND: bindDirective,
  HTML: htmlDirective,
  MODEL: modelDirective,
  SHOW: showDirective,
  ON: onDirective,
  TEXT: textDirective,
  FOR: forDirective,
};

export const renderDirective = (props: DirectiveProps, directives: Directives): void => {
  directives[props.parts[0].toUpperCase()](props);
};

export default renderDirective;
