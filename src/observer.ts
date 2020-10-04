const observer = (
  data: Function | any,
  patch: Function,
  vdom: Record<string, any> | null
): ProxyConstructor => {
  const handler = {
    get(target: Record<string, any>, key: string): any {
      if (
        key === 'push' ||
        key === 'pop' ||
        key === 'shift' ||
        key === 'unshift' ||
        key === 'splice' ||
        key === 'slice'
      ) {
        return (...args: any[]) => {
          target[key].apply(target, args);
        };
      }
      if (
        typeof target[key] === 'object' &&
        target[key] !== null &&
        !(target[key] instanceof Array)
      ) {
        return new Proxy(target[key], handler);
      } else {
        return target[key];
      }
    },
    set(target: Record<string, any>, key: string, value: any): boolean {
      target[key] = value;
      if (key !== 'length') patch(vdom, [key]);

      return true;
    },
    deleteProperty(target: Record<string, any>, key: string): boolean {
      if (key !== 'length') {
        delete target[key];
        patch(vdom, [key]);
        return true;
      } else {
        return delete target[key];
      }
    },
  };
  return new Proxy(data, handler);
};

export default observer;
