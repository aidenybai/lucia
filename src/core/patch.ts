import { UnknownKV } from '../models/generics';
import { Directives, ASTNode } from '../models/structs';

import { renderDirective } from './directive';

const patch = (
  ast: ASTNode[],
  directives: Directives,
  state: UnknownKV = {},
  changedKeys: string[] = []
): void => {
  const staticNodeCleanupQueue: number[] = [];

  for (let i = 0; i < ast.length; i++) {
    const node = ast[i];
    const isStatic = node.type === 0;
    // Queue static nodes into garbage collection
    if (isStatic) staticNodeCleanupQueue.push(i);

    const nodeHasKey = changedKeys.some((key) => node.keys.includes(key));

    if (!nodeHasKey && !isStatic) continue;

    for (const [directiveName, directiveData] of Object.entries(node.directives)) {
      // Iterate through affected keys and check if directive value has key
      const directiveHasKey = changedKeys.some((key) => directiveData.keys.includes(key));

      // If affected, then push to render queue
      if (directiveHasKey || isStatic) {
        const directiveProps = { el: node.el, name: directiveName, data: directiveData, state };
        renderDirective(directiveProps, directives);
      }
    }
  }

  for (const i of staticNodeCleanupQueue) {
    ast.splice(i, 1);
  }
};

export default patch;
