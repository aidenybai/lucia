import { UnknownKV } from '../models/generics';
import { Directives, DOMNode } from '../models/structs';

import { renderDirective } from './directive';

const patch = (
  DOMNodes: DOMNode[],
  directives: Directives,
  state: UnknownKV = {},
  changedKeys: string[] = []
): void => {
  let deleteDOMNodes: number[] = [];

  for (let i = 0; i < DOMNodes.length; i++) {
    const node = DOMNodes[i];
    if (node.isDynamic === undefined) deleteDOMNodes.push(i);
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

  for (const i of deleteDOMNodes) {
    DOMNodes.splice(i, 1);
  }
};

export default patch;
