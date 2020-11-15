import arrayEquals from '../helpers/arrayEquals';

const observer = (view: Function | any, patch: Function): Record<string, any> => {
  const handler = {
    get(target: Record<string, any>, key: string): unknown {
      if (typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler);
      } else {
        return target[key];
      }
    },
    set(target: any, key: string, value: unknown): boolean {
      target[key] = value;
      if (key === 'length') {
        patch(
          Object.keys(view).filter((key: string) => {
            return view[key] instanceof Array && arrayEquals(target, view[key]);
          })
        );
      } else {
        patch([key]);
      }
      return true;
    },
    deleteProperty(target: Record<string, any>, key: string): boolean {
      delete target[key];
      if (key === 'length') {
        patch(
          Object.keys(view).filter((key: string) => {
            return view[key] instanceof Array;
          })
        );
      } else {
        patch([key]);
      }
      return true;
    },
  };
  return new Proxy(view, handler);
};

export default observer;
