export const observer = (
  data: any | Function,
  patch: Function,
  vdom: Record<string, any>
): ProxyConstructor => {
  return new Proxy(data, {
    // get(target: Record<string, any>, key: string): boolean {
    //   patch(vdom, data);
    //   return target[key];
    // },
    set(target: Record<string, any>, key: string, value: any): boolean {
      target[key] = value;
      patch(vdom, data);
      return true;
    },
    deleteProperty(target: Record<string, any>, key: string): boolean {
      delete target[key];
      patch(vdom, data);
      return true;
    },
  });
};

export default observer;
