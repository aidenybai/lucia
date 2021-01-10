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
  // Currently double patches - bad perf
  if ((!isNaN(Number(key)) || key === 'length') && target instanceof Array) {
    const keys = Object.keys(state).filter((k) =>
      arrayEquals(state[k] as unknown[], target as unknown[])
    );

    // Patch only if found any affected keys
    if (keys.length !== 0) patch(keys);
  } else {
    const keys = [key];
    if (needsUpdate) patch(keys);
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

  return new Proxy(Object.seal(state), handler);
};

export default reactive;
