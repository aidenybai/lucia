import { UnknownKV } from '../models/generics';
import { Directives, ASTNode } from '../models/structs';

import { renderDirective } from './directive';

const patch = (
  ast: ASTNode[],
  directives: Directives,
  state: UnknownKV = {},
  changedKeys: string[] = []
): void => {
  let deleteASTNodes: number[] = [];

  for (let i = 0; i < ast.length; i++) {
    const node = ast[i];
    // Queue static nodes into garbage collection
    if (node.isDynamic === undefined) deleteASTNodes.push(i);
    if (!node.isDynamic) node.isDynamic = undefined;

    for (const [directiveName, directiveData] of Object.entries(node.directives)) {
      // Iterate through affected keys and check if directive value has key
      const hasKey = changedKeys.some((key) => directiveData.keys.includes(key));

      // If affected, then push to render queue
      if (hasKey || !node.isDynamic) {
        renderDirective(
          { el: node.el, name: directiveName, data: directiveData, state },
          { ...directives }
        );
      }
    }
  }

  for (const i of deleteASTNodes) {
    ast.splice(i, 1);
  }
};

export default patch;
