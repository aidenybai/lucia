import { UnknownKV } from '../models/generics';
import { State } from '../models/structs';

import arrayEquals from './utils/arrayEquals';

interface RevocableProxy {
  proxy: UnknownKV;
  revoke: Function;
}

export const reactive = (state: State, callback: Function): RevocableProxy => {
  const handler = {
    get(target: UnknownKV, key: string, receiver: unknown): unknown {
      if (typeof target[key] === 'object' && target[key] !== null) {
        // Deep proxy - if there is an object in an object, need to proxify that.
        return new Proxy(target[key] as UnknownKV, handler);
      } else {
        return Reflect.get(target, key, receiver);
      }
    },
    set(target: UnknownKV, key: string, value: unknown, receiver: unknown): boolean {
      // Currently double patches - bad perf
      const hasArrayMutationKey = !isNaN(Number(key)) || key === 'length';

      // Do not allow function mutation
      if (typeof state[key] === 'function') {
        return false;
      } else if (target instanceof Array && hasArrayMutationKey) {
        const keys = Object.keys(state).filter((k) =>
          arrayEquals(state[k] as unknown[], target as unknown[])
        );

        // Patch only if found any affected keys
        callback(keys);
      } else {
        // Bad perf way of handling nested objects
        if (Object.keys(state).some((key) => target[key] === undefined)) {
          callback(Object.keys(state).filter((key) => typeof state[key] === 'object'));
        } else {
          callback([key]);
        }
      }

      return Reflect.set(target, key, value, receiver);
    },
  };

  // State is sealed, meaning values are mutable, but size is immutable
  return Proxy.revocable(Object.seal(state), handler);
};

export default reactive;
