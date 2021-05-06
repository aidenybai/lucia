import compile from '@core/compile';
import { directives } from '@core/directive';
import render from '@core/render';
import { COMPONENT_FLAG } from '@models/generics';
import { ASTNode, DirectiveProps } from '@models/structs';
import adjustDeps from '@utils/adjustDeps';
import { hasDirectiveRE } from '@utils/patterns';

export const htmlDirective = ({ el, data, state, node }: DirectiveProps): void => {
  node = node!;
  const marker = el[COMPONENT_FLAG] as ASTNode[];
  const ret = data.compute(state) ?? data.value;

  if (ret !== el.innerHTML) {
    el.innerHTML = ret;

    if (hasDirectiveRE().test(ret)) {
      const ast = marker ?? compile(el, state, true);

      if (!marker) adjustDeps(ast, data.deps, node, 'html');

      render(ast, directives, state, data.deps);

      el[COMPONENT_FLAG] = ast;
    }
  }
};
