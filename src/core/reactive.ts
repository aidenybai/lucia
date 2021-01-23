import { UnknownKV } from '../models/generics';
import { State } from '../models/structs';

import arrayEquals from './utils/arrayEquals';

interface RevocableProxy {
  proxy: UnknownKV;
  revoke: Function;
}

export const reactive = (state: State, callback: Function): RevocableProxy => {
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
      // Do not allow function mutation
      if (typeof state[key] === 'function') return false;

      // Currently double patches - bad perf
      const hasArrayMutationKey = !isNaN(Number(key)) || key === 'length';
      let keys = [];

      if (target instanceof Array && hasArrayMutationKey) {
        keys = Object.keys(state).filter((k) =>
          arrayEquals(state[k] as unknown[], target as unknown[])
        );
      } else {
        // Bad perf way of handling nested objects
        if (Object.keys(state).some((key) => target[key] === undefined)) {
          keys = Object.keys(state).filter((key) => typeof state[key] === 'object');
        } else {
          keys = [key];
        }
      }

      target[key] = value;
      callback(keys);

      return true;
    },
  };

  // State is sealed, meaning values are mutable, but size is immutable
  return Proxy.revocable(Object.seal(state), handler);
};

export default reactive;
