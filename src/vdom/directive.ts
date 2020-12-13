import { Directives, DirectiveProps } from '../models/structs';

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

export const renderDirective = (
  { el, name, value, view }: DirectiveProps,
  directives: Directives
) => {
  const rootName = name.split(/:|\./)[0]; // Split directive:modifier.property
  directives[rootName.toUpperCase()]({ el, name, value, view });
};

export default renderDirective;
