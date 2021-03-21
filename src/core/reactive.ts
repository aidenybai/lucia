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
      if (typeof target[key] === 'object' && target[key] !== null) {
        // Deep proxy - if there is an object in an object, need to proxify that.
        return new Proxy(target[key] as UnknownKV, handler);
      } else {
        return target[key];
      }
    },
    set(target: UnknownKV, key: string, value: unknown): boolean {
      // Do not allow function mutation
      if (typeof state[key] === 'function' || key.startsWith('$')) return false;

      // Currently double renderes - bad perf
      const hasArrayMutationKey = !isNaN(Number(key)) || key === 'length';
      const props = [key];

      if (target instanceof Array && hasArrayMutationKey) {
        props.push(
          ...Object.keys(state).filter((prop) =>
            arrayEquals(state[prop] as unknown[], target as unknown[])
          )
        );
      } else {
        // Bad perf way of handling nested objects
        if (Object.keys(state).some((prop) => target[prop] === undefined)) {
          props.push(...Object.keys(state).filter((prop) => typeof state[prop] === 'object'));
        }
      }

      target[key] = value;
      callback(props);
      for (const [prop, watcher] of Object.entries(watchers)) {
        if (props.includes(prop)) watcher();
      }

      return true;
    },
  };

  // State is sealed, meaning values are mutable, but size is immutable
  return new Proxy(Object.seal(state), handler);
};

export default reactive;
