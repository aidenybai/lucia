import { CONCURRENT_MODE_THRESHOLD, DIRECTIVE_PREFIX, UnknownKV } from '../models/generics';
import { ASTNode, ASTNodeType, Directives } from '../models/structs';
import { renderDirective } from './directive';
import concurrent from './utils/concurrent';
import { rawDirectiveSplitRE } from './utils/patterns';

const render = (
  ast: ASTNode[],
  directives: Directives,
  state: UnknownKV = {},
  changedProps: string[] = []
): void => {
  const legalDirectiveNames = Object.keys(directives);

  concurrent(CONCURRENT_MODE_THRESHOLD, function* () {
    for (const node of ast) {
      if (node.type === ASTNodeType.NULL) continue;
      yield;
      const isStatic = node.type === ASTNodeType.STATIC;
      if (isStatic) node.type = ASTNodeType.NULL;

      const nodeHasDep = changedProps.some((prop) => node.deps.includes(prop));

      if (!nodeHasDep && !isStatic) continue;

      for (const [directiveName, directiveData] of Object.entries(node.directives)) {
        yield;
        const rawDirectiveName = directiveName.split(rawDirectiveSplitRE())[0];
        // Validate if it is a legal directive
        if (!legalDirectiveNames.includes(rawDirectiveName.toUpperCase())) continue;
        // Iterate through affected and check if directive value has prop
        const directiveHasDep = changedProps.some((prop) => directiveData.deps.includes(prop));

        const isMaskDirective = directiveName === `${DIRECTIVE_PREFIX}mask`;
        const isStaticDirective = Object.keys(directiveData.deps).length === 0;

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

          if (isStaticDirective || isMaskDirective) {
            delete node.directives[directiveName];
            if (isMaskDirective) {
              /* istanbul ignore next */
              node.el.removeAttribute(`${DIRECTIVE_PREFIX}mask`);
            }
          }
        }
      }
    }
  })();
};

export default render;
