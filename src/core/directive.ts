import { DirectiveProps, Directives } from '@models/structs';
import { bindDirective } from '@directives/bind';
import { forDirective } from '@directives/for';
import { htmlDirective } from '@directives/html';
import { modelDirective } from '@directives/model';
import { onDirective } from '@directives/on';
import { showDirective } from '@directives/show';
import { textDirective } from '@directives/text';

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
