import { UnknownKV } from '../models/generics';
import { State } from '../models/structs';

import arrayEquals from './utils/arrayEquals';

export const handlePatch = (
  target: UnknownKV | unknown[],
  key: string,
  state: State,
  patch: Function,
  needsUpdate: boolean = false
) => {
  // Capture array mutators, as they will pass 'length' as key
  if (key === 'length') {
    const affectedKeys = Object.keys(state).filter((k: string) => {
      // Filter out (arrays && if affected array is the array) from state
      return state[k] instanceof Array && arrayEquals(target as unknown[], state[k] as unknown[]);
    });
    // Patch only if found any affected keys
    if (affectedKeys.length !== 0) patch(affectedKeys);
    return true;
  } else {
    if (needsUpdate) patch([key]);
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
      const needsUpdate = target[key] !== value;
      if (needsUpdate) {
        target[key] = value;
      }
      handlePatch(target, key, state, patch, needsUpdate);
      return true;
    },
    deleteProperty(target: UnknownKV, key: string): boolean {
      delete target[key];
      handlePatch(target, key, state, patch);
      return true;
    },
  };
  return new Proxy(state, handler);
};

export default reactive;
