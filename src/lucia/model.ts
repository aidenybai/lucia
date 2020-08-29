export default class Model {
  constructor(callback: any) {
    const proxy = new Proxy(this, {
      get(target: any, property: any) {
        return target[property];
      },
      set(target: any, property: any, value: any) {
        const oldValue = target[property];
        target[property] = value;
        if (callback) {
          callback(property, oldValue, value);
        }
        return true;
      },
    });
    return proxy;
  }
}
