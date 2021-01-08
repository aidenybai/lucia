import { UnknownKV } from '../models/generics';
import { Directives, FunctionGroup, DOMNode } from '../models/structs';

import { renderDirective } from './directive';

const patch = (
  DOMNodes: DOMNode[],
  directives: Directives,
  state: UnknownKV = {},
  changedKeys: string[] = []
): void => {
  for (let i = 0; i < DOMNodes.length; i++) {
    const node = DOMNodes[i];
    for (const [directiveName, directiveData] of Object.entries(node.directives)) {
      // Iterate through affected keys and check if directive value has key
      const hasKey = changedKeys.some((key) => {
        if (Object.keys(state.$functionKeys as FunctionGroup).includes(key)) {
          for (const k of changedKeys) {
            if ((state.$functionKeys as FunctionGroup)[key].includes(k)) return true;
          }
          return false;
        } else {
          return directiveData.keys.includes(key);
        }
      });

      // If affected, then push to render queue
      if (hasKey) {
        const el = node.el;

        renderDirective({ el, name: directiveName, data: directiveData, state }, { ...directives });
      }
    }
  }
};

export default patch;
