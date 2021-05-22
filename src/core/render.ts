import { KV } from '@models/generics';
import { ASTNode, ASTNodeType, Directives } from '@models/structs';
import { renderDirective } from './directive';
import lazy from '@utils/lazy';
import { rawDirectiveSplitRE } from '@utils/patterns';

const render = (
  ast: ASTNode[],
  directives: Directives,
  state: KV<unknown>,
  changedProps: string[],
): void => {
  const legalDirectiveNames = Object.keys(directives);
  const LAZY_MODE_TIMEOUT = 25;

  lazy(LAZY_MODE_TIMEOUT, function* () {
    /* istanbul ignore next */
    for (const node of ast) {
      if (node.type === ASTNodeType.NULL) continue;
      const isStatic = node.type === ASTNodeType.STATIC;
      if (isStatic) node.type = ASTNodeType.NULL;
      yield;

      const nodeHasDep = changedProps.some((prop) => node.deps.includes(prop));

      if (!nodeHasDep && !isStatic) continue;

      for (const [directiveName, directiveData] of Object.entries(node.directives)) {
        const rawDirectiveName = directiveName.split(rawDirectiveSplitRE())[0];
        // Validate if it is a legal directive
        if (!legalDirectiveNames.includes(rawDirectiveName.toUpperCase())) continue;
        yield;
        // Iterate through affected and check if directive value has prop
        const directiveHasDep =
          directiveData.deps.length === node.deps.length ||
          changedProps.some((prop) => directiveData.deps.includes(prop));
        const isStaticDirective = directiveData.deps.length === 0;

        // If affected, then push to render queue
        if (directiveHasDep || isStatic || isStaticDirective) {
          const directiveProps = {
            el: node.el,
            parts: directiveName.split(rawDirectiveSplitRE()),
            data: directiveData,
            node,
            state,
          };

          renderDirective(directiveProps, directives);

          if (isStaticDirective) {
            delete node.directives[directiveName];
          }
        }
      }
    }
  })();
};

export default render;
