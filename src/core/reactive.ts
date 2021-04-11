import { UnknownKV } from '../models/generics';
import { State, Watchers } from '../models/structs';

export const arrayEquals = (firstArray: unknown[], secondArray: unknown[]) => {
  // Deep Array equality check
  return (
    firstArray instanceof Array &&
    secondArray instanceof Array &&
    firstArray.length === secondArray.length &&
    firstArray.every((value: unknown, i: number) => value === secondArray[i])
  );
};

export const reactive = (
  state: State,
  callback: (props: string[]) => void,
  watchers: Watchers = {}
): State => {
  const handler = {
    get(target: UnknownKV, key: string): unknown {
      const ret = target[key];

      if (typeof ret === 'object' && ret !== null) {
        // Deep proxy - if there is an object in an object, need to proxify that.
        return new Proxy(ret, handler);
      } else {
        return ret;
      }
    },
    set(target: UnknownKV, key: string, value: unknown): boolean {
      // Currently double renderes - bad perf
      const hasArrayMutationKey = !isNaN(Number(key)) || key === 'length';
      const props = [key];

      if (target instanceof Array && hasArrayMutationKey) {
        props.push(
          ...Object.keys(state).filter((prop) => {
            return (
              // Find the array that equals the target
              state[prop] instanceof Array &&
              arrayEquals(state[prop] as unknown[], target as unknown[])
            );
          })
        );
      } else {
        // For this case, we don't know if the key is on the global state,
        // So we need to check if it is a nested object:
        if (!Object.is(target, state)) {
          props.push(
            ...Object.keys(state).filter((prop) => {
              return (
                // Lazy way of checking if key exists under one layer down nested objects
                Object.prototype.toString.call(state[prop]) === '[object Object]' &&
                JSON.stringify(state[prop]).indexOf(key) > -1
              );
            })
          );
        }
      }

      target[key] = value;
      callback(props);
      Object.entries(watchers).forEach(([prop, watcher]) => {
        /* istanbul ignore next */
        if (props.includes(prop)) watcher();
      });

      return true;
    },
  };

  // State is sealed, meaning values are mutable, but size is immutable
  return new Proxy(Object.seal(state), handler);
};

export default reactive;
