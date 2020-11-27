import { bindDirective } from './directives/bind';
import { joinDirective } from './directives/join';
import { htmlDirective } from './directives/html';
import { ifDirective } from './directives/if';
import { modelDirective } from './directives/model';
import { onDirective } from './directives/on';
import { textDirective } from './directives/text';
import { DirectiveArgs } from './directives/IDirectiveArgs';

export class DirectivesManager {
  directives: Record<string, Function>;

  constructor(customDirectives?: Record<string, Function>) {
    this.directives = customDirectives || {
      bind: bindDirective,
      join: joinDirective,
      html: htmlDirective,
      if: ifDirective,
      model: modelDirective,
      on: onDirective,
      text: textDirective,
    };
  }

  register(name: string, fn: Function) {
    this.directives[name] = fn;
  }

  render({ el, name, value, view }: DirectiveArgs) {
    const rootName = name.split(/:|\./)[0]; // Split directive:modifier.property
    this.directives[rootName]({ el, name, value, view });
  }
}

export default DirectivesManager;
