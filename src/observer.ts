const observer = (
  data: any | Function,
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
      patch(vdom, [key]);
      return true;
    },
    deleteProperty(target: Record<string, any>, key: string): boolean {
      delete target[key];
      patch(vdom, [key]);
      return true;
    },
  };
  return new Proxy(data, handler);
};

export default observer;
