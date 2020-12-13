import { UnknownKV } from '../models/generics';
import { View } from '../models/structs';

import arrayEquals from './utils/arrayEquals';

export const handleArray = (
  target: UnknownKV | unknown[],
  key: string,
  view: View,
  patch: Function
) => {
  // Capture array mutators, as they will pass 'length' as key
  if (key === 'length') {
    const affectedKeys = Object.keys(view).filter((k: string) => {
      // Filter out (arrays && if affected array is the array) from view
      return view[k] instanceof Array && arrayEquals(target as unknown[], view[k] as unknown[]);
    });
    // Patch only if found any affected keys
    if (affectedKeys.length !== 0) patch(affectedKeys);
    return true;
  } else {
    patch([key]);
    return false;
  }
};

export const observer = (view: View, patch: Function): UnknownKV => {
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
      target[key] = value;
      handleArray(target, key, view, patch);
      return true;
    },
    deleteProperty(target: UnknownKV, key: string): boolean {
      delete target[key];
      handleArray(target, key, view, patch);
      return true;
    },
  };
  return new Proxy(view, handler);
};

export default observer;
