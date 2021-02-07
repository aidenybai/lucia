import { UnknownKV } from '../models/generics';
import { Directives, ASTNode } from '../models/structs';

import { renderDirective } from './directive';

const render = (
  ast: ASTNode[],
  directives: Directives,
  state: UnknownKV = {},
  changedProps: string[] = []
): void => {
  const staticNodeCleanupQueue: number[] = [];
  const legalDirectiveNames = Object.keys(directives);

  for (let i = 0; i < ast.length; i++) {
    const node = ast[i];
    const isStatic = node.type === 0;

    // Queue static nodes into garbage collection
    if (isStatic) staticNodeCleanupQueue.push(i);

    const nodeHasDep = changedProps.some((prop) => node.deps.includes(prop));

    if (!nodeHasDep && !isStatic) continue;

    for (const [directiveName, directiveData] of Object.entries(node.directives)) {
      const rawDirectiveName = directiveName.split(/:|\./)[0];
      // Validate if it is a legal directive
      if (!legalDirectiveNames.includes(rawDirectiveName.toUpperCase())) continue;
      // Iterate through affected and check if directive value has prop
      const directiveHasDep = changedProps.some((prop) => directiveData.deps.includes(prop));

      const isStaticDirective = Object.keys(directiveData.deps).length === 0;

      // If affected, then push to render queue
      if (directiveHasDep || isStatic || isStaticDirective) {
        const directiveProps = {
          el: node.el,
          name: directiveName,
          data: directiveData,
          node,
          state,
        };
        renderDirective(directiveProps, directives);

        if (isStaticDirective) delete node.directives[directiveName];
      }
    }
  }

  for (const i of staticNodeCleanupQueue) {
    ast.splice(i, 1);
  }
};

export default render;
