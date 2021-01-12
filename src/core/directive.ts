import { Directives, DirectiveProps } from '../models/structs';

import { rawDirectiveSplitRE } from './utils/patterns';

import { bindDirective } from './directives/bind';
import { htmlDirective } from './directives/html';
import { ifDirective } from './directives/if';
import { modelDirective } from './directives/model';
import { onDirective } from './directives/on';
import { textDirective } from './directives/text';
import { forDirective } from './directives/for';

export const directives: Directives = {
  BIND: bindDirective,
  HTML: htmlDirective,
  IF: ifDirective,
  MODEL: modelDirective,
  ON: onDirective,
  TEXT: textDirective,
  FOR: forDirective,
};

export const renderDirective = (props: DirectiveProps, directives: Directives): void => {
  const name = props.name.split(rawDirectiveSplitRE())[0];
  directives[name.toUpperCase()](props);
};

export default renderDirective;
