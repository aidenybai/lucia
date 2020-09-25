const observer = (
  data: any | Function,
  patch: Function,
  vdom: Record<string, any> | null
): ProxyConstructor => {
  return new Proxy(data, {
    set(target: Record<string, any>, key: string, value: any): boolean {
      target[key] = value;
      patch(vdom);
      return true;
    },
    deleteProperty(target: Record<string, any>, key: string): boolean {
      delete target[key];
      patch(vdom);
      return true;
    },
  });
};

export default observer;
