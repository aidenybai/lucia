import { UnknownKV } from '../models/generics';
import { State, FunctionGroup } from '../models/structs';

import arrayEquals from './utils/arrayEquals';
import { expressionPropRE } from './utils/patterns';

export const handlePatch = (
  target: UnknownKV | unknown[],
  key: string,
  state: State,
  patch: Function,
  needsUpdate: boolean = false
) => {
  // Capture array mutators, as they will pass 'length' as key
  if (key === 'length' || target instanceof Array) {
    const keys = Object.keys(state).filter((k) =>
      arrayEquals(state[k] as unknown[], target as unknown[])
    );

    // Patch only if found any affected keys
    if (keys.length !== 0) patch(keys);
    return true;
  } else {
    const keys = [key];

    // WARN: Bad way of implementing arr, as l-for scopes do not sync with master
    // meaning that any scopes need to be repatched to update.

    // for (const el of document.querySelectorAll('[l-for]')) {
    //   // @ts-ignore
    //   const stateKeys = Object.keys(el.__l.state);

    //   if (stateKeys.indexOf(key) !== -1) {
    //     stateKeys.splice(stateKeys.indexOf(key), 1);

    //     for (const k of stateKeys) {
    //       keys.push(k);
    //     }
    //   }
    // }

    if (needsUpdate) patch(keys);
    return false;
  }
};

export const reactive = (state: State, patch: Function): UnknownKV => {
  const handler = {
    get(target: UnknownKV, key: string): unknown {
      if (typeof target[key] === 'object' && target[key] !== null) {
        // Deep proxy - if there is an object in an object, need to proxify that.
        return new Proxy(target[key] as UnknownKV, handler);
      } else {
        return target[key];
      }
    },
    set(target: UnknownKV, key: string, value: unknown): boolean {
      const needsUpdate =
        target[key] !== value || target instanceof Array || typeof target === 'object';

      if (needsUpdate) {
        target[key] = value;
      }
      handlePatch(target, key, state, patch, needsUpdate);
      return true;
    },
    deleteProperty(target: UnknownKV, key: string): boolean {
      delete target[key];
      handlePatch(target, key, state, patch, true);
      return true;
    },
  };
  state.$functionKeys = {};
  // Iterate through state keys
  const stateWithOnlyFunctions = Object.entries(state).filter(
    ([, value]) => typeof value === 'function'
  );

  for (const [key, value] of stateWithOnlyFunctions) {
    let keysInFunction = Object.keys(state).filter((k) => expressionPropRE(k).test(String(value)));
    (state.$functionKeys as FunctionGroup)[key] = keysInFunction;
  }

  return new Proxy(state, handler);
};

export default reactive;
