export default (
  data: any | Function,
  patch: Function,
  vdom: Record<string, any>
): ProxyConstructor => {
  return new Proxy(data, {
    set(target: Record<string, any>, key: string, value: any) {
      target[key] = value;
      patch(vdom, data);
      return true;
    },
    deleteProperty(target: Record<string, any>, key: string) {
      delete target[key];
      patch(vdom, data);
      return true;
    },
  });
};
