const observer = (
  view: Function | any,
  patch: Function,
  vdom: Record<string, any> | null
): ProxyConstructor => {
  const handler = {
    get(target: Record<string, any>, key: string): any {
      if (typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler);
      } else {
        return target[key];
      }
    },
    set(target: Record<string, any>, key: string, value: any): boolean {
      target[key] = value;
      // Support array mutators - note that it patches ALL arrays, not specific ones
      if (key === 'length') {
        patch(
          vdom,
          Object.keys(view).filter((key: string) => {
            return view[key] instanceof Array;
          })
        );
      } else {
        patch(vdom, [key]);
      }
      return true;
    },
    deleteProperty(target: Record<string, any>, key: string): boolean {
      delete target[key];
      if (key === 'length') {
        patch(
          vdom,
          Object.keys(view).filter((key: string) => {
            return view[key] instanceof Array;
          })
        );
      } else {
        patch(vdom, [key]);
      }
      return true;
    },
  };
  return new Proxy(view, handler);
};

export default observer;
