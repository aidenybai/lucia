import arrayEquals from '../utils/arrayEquals';

const handleArray = (
  target: Record<string, any> | any,
  key: string,
  view: Function | any,
  patch: Function
) => {
  // Capture array mutators, as they will pass 'length' as key
  if (key === 'length') {
    const affectedKeys = Object.keys(view).filter((key: string) => {
      // Filter out (arrays && if affected array is the array) from view
      return view[key] instanceof Array && arrayEquals(target, view[key]);
    });
    // Patch only if found any affected keys
    if (affectedKeys.length !== 0) patch(affectedKeys);
  } else {
    patch([key]);
  }
};

const observer = (view: Function | any, patch: Function): Record<string, any> => {
  const handler = {
    get(target: Record<string, any>, key: string): unknown {
      if (typeof target[key] === 'object' && target[key] !== null) {
        // Deep proxy - if there is an object in an object, need to proxify that.
        return new Proxy(target[key], handler);
      } else {
        return target[key];
      }
    },
    set(target: Record<string, any> | any, key: string, value: unknown): boolean {
      target[key] = value;
      handleArray(target, key, view, patch);
      return true;
    },
    deleteProperty(target: Record<string, any> | any, key: string): boolean {
      delete target[key];
      handleArray(target, key, view, patch);
      return true;
    },
  };
  return new Proxy(view, handler);
};

export default observer;
