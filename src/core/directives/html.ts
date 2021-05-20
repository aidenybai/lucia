import compile from '@core/compile';
import { directives } from '@core/directive';
import render from '@core/render';
import { COMPONENT_FLAG } from '@models/generics';
import { ASTNode, DirectiveProps } from '@models/structs';
import rewriteWithNewDeps from '@utils/rewriteWithNewDeps';
import { hasDirectiveRE } from '@utils/patterns';

export const htmlDirective = ({ el, data, state, node }: DirectiveProps): void => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  node = node!;
  const marker = el[COMPONENT_FLAG] as ASTNode[];
  /* istanbul ignore next */
  const ret = data.compute(state) ?? data.value;

  /* istanbul ignore next */
  if (ret !== el.innerHTML) {
    el.innerHTML = ret;

    /* istanbul ignore next */
    if (hasDirectiveRE().test(ret)) {
      const ast = marker ?? compile(el, state, true);

      if (!marker) rewriteWithNewDeps(ast, data.deps, node, 'html');

      render(ast, directives, state, data.deps);

      el[COMPONENT_FLAG] = ast;
    }
  }
};
