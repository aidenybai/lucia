import { DirectiveProps, Directives } from '@models/structs';
import { bindDirective } from '@directives/bind';
import { forDirective } from '@directives/for';
import { htmlDirective } from '@directives/html';
import { modelDirective } from '@directives/model';
import { onDirective } from '@directives/on';
import { showDirective } from '@directives/show';
import { textDirective } from '@directives/text';

// @ts-expect-error: LuciaDirectives doesn't exist on window, but we create it.
const customGlobalDirectives = window.LuciaDirectives || {};

export const directives: Directives = {
  BIND: bindDirective,
  HTML: htmlDirective,
  MODEL: modelDirective,
  SHOW: showDirective,
  ON: onDirective,
  TEXT: textDirective,
  FOR: forDirective,
  ...customGlobalDirectives,
};

export const renderDirective = (props: DirectiveProps, directives: Directives): void => {
  directives[props.parts[0].toUpperCase()](props);
};

export default renderDirective;
