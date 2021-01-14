import { UnknownKV } from '../models/generics';
import { State } from '../models/structs';

import arrayEquals from './utils/arrayEquals';

export const reactive = (state: State, callback: Function): UnknownKV => {
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
      // Currently double patches - bad perf
      const hasArrayMutationKey = !isNaN(Number(key)) || key === 'length';
      const needsUpdate =
        hasArrayMutationKey ||
        target instanceof Array ||
        target[key] !== value ||
        typeof target === 'object';

      if (typeof state[key] === 'function') {
        return false;
      } else if (target instanceof Array && hasArrayMutationKey) {
        target[key] = value;

        const keys = Object.keys(state).filter((k) =>
          arrayEquals(state[k] as unknown[], target as unknown[])
        );

        // Patch only if found any affected keys
        if (keys.length !== 0) callback(keys);
      } else {
        if (needsUpdate) {
          target[key] = value;

          // Bad perf way of handling nested objects
          if (Object.keys(state).some((key) => !target[key])) {
            callback(Object.keys(state).filter((key) => typeof state[key] === 'object'));
          } else {
            callback([key]);
          }
        }
      }

      return true;
    },
  };

  // State is sealed, meaning values are mutable, but size is immutable
  return new Proxy(Object.seal(state), handler);
};

export default reactive;
