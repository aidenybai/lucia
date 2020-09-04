export default (data: any, patch: any, vdom: any) => {
  return new Proxy(data, {
    set(target, key, value) {
      target[key] = value;
      patch(vdom, data);
      return true;
    },
    deleteProperty(target, key) {
      delete target[key];
      patch(vdom, data);
      return true;
    },
  });
}