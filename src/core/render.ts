import { DIRECTIVE_PREFIX, UnknownKV } from '../models/generics';
import { Directives, ASTNode, ASTNodeType } from '../models/structs';
import { rawDirectiveSplitRE } from './utils/patterns';
import concurrent from './utils/concurrent';

import { renderDirective } from './directive';

const render = (
  ast: ASTNode[],
  directives: Directives,
  state: UnknownKV = {},
  changedProps: string[] = []
): void => {
  if (typeof changedProps === 'string') changedProps = [changedProps];
  const legalDirectiveNames = Object.keys(directives);

  function* traverse() {
    for (const node of ast) {
      yield;
      if (node.type === ASTNodeType.NULL) continue;

      const isStatic = node.type === ASTNodeType.STATIC;
      if (isStatic) node.type = ASTNodeType.NULL;

      const nodeHasDep = changedProps.some((prop) => node.deps.includes(prop));

      if (!nodeHasDep && !isStatic) continue;

      for (const [directiveName, directiveData] of Object.entries(node.directives)) {
        yield;
        const rawDirectiveName = directiveName.split(/:|\./)[0];
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
          yield;
          renderDirective(directiveProps, directives);

          if (isStaticDirective || isMaskDirective) {
            delete node.directives[directiveName];
            if (isMaskDirective) {
              node.el.removeAttribute(`${DIRECTIVE_PREFIX}mask`);
            }
          }
        }
      }
    }
  }

  concurrent(traverse)();
};

export default render;
