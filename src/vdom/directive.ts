import { Directives, DirectiveProps } from '../models/structs';

import { rawDirectiveSplitPattern } from './utils/patterns';

import { bindDirective } from './directives/bind';
import { htmlDirective } from './directives/html';
import { ifDirective } from './directives/if';
import { joinDirective } from './directives/join';
import { modelDirective } from './directives/model';
import { onDirective } from './directives/on';
import { textDirective } from './directives/text';

export const directives: Directives = {
  BIND: bindDirective,
  JOIN: joinDirective,
  HTML: htmlDirective,
  IF: ifDirective,
  MODEL: modelDirective,
  ON: onDirective,
  TEXT: textDirective,
};

export const renderDirective = (props: DirectiveProps, directives: Directives): void => {
  const name = props.name.split(rawDirectiveSplitPattern)[0];
  directives[name.toUpperCase()](props);
};

export default renderDirective;
