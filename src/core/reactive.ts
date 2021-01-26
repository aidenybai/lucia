import { UnknownKV } from '../models/generics';
import { State } from '../models/structs';

export interface RevocableProxy {
  proxy: UnknownKV;
  revoke: Function;
}

export const arrayEquals = (firstArray: unknown[], secondArray: unknown[]) => {
  // Deep Array equality check
  return (
    firstArray instanceof Array &&
    secondArray instanceof Array &&
    firstArray.length === secondArray.length &&
    firstArray.every((value: unknown, i: number) => value === secondArray[i])
  );
};

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
      let props = [];

      if (target instanceof Array && hasArrayMutationKey) {
        props = Object.keys(state).filter((prop) =>
          arrayEquals(state[prop] as unknown[], target as unknown[])
        );
      } else {
        // Bad perf way of handling nested objects
        if (Object.keys(state).some((prop) => target[prop] === undefined)) {
          props = Object.keys(state).filter((prop) => typeof state[prop] === 'object');
        } else {
          props = [key];
        }
      }

      target[key] = value;
      callback(props);

      return true;
    },
  };

  // State is sealed, meaning values are mutable, but size is immutable
  return Proxy.revocable(Object.seal(state), handler);
};

export default reactive;
