class DeepProxy {
  preproxy: WeakMap<object, any>;
  target: Record<string, any> | any;
  handler: Record<any, any>;

  constructor(target: Record<string, any>, handler: Record<any, any>) {
    this.preproxy = new WeakMap();
    this.target = target;
    this.handler = handler;
  }

  init(): Record<any, any> {
    return this.proxify(this.target, []);
  }

  createHandler(path: any[]): Record<any, any> {
    const set = (target: Record<any, any>, key: string, value: any, receiver: any) => {
      if (typeof value === 'object') {
        value = this.proxify(value, [...path, key]);
      }
      target[key] = value;

      if (this.handler.set) {
        this.handler.set(target, [...path, key], value, receiver);
      }
      return true;
    };

    const deleteProperty = (target: Record<any, any>, key: string) => {
      if (Reflect.has(target, key)) {
        this.unproxy(target, key);
        let deleted = Reflect.deleteProperty(target, key);
        if (deleted && this.handler.deleteProperty) {
          this.handler.deleteProperty(target, [...path, key]);
        }
        return deleted;
      }
      return false;
    };

    return { set: set.bind(this), deleteProperty: deleteProperty.bind(this) };
  }

  unproxy(data: Record<any, any>, key: string): void {
    if (this.preproxy.has(data[key])) {
      data[key] = this.preproxy.get(data[key]);
      this.preproxy.delete(data[key]);
    }

    for (let k of Object.keys(data[key])) {
      if (typeof data[key][k] === 'object') {
        this.unproxy(data[key], k);
      }
    }
  }

  proxify(data: Record<any, any>, path: any[]): Record<any, any> {
    for (const key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        data[key] = this.proxify(data[key], [...path, key]);
      }
    }

    const proxy = new Proxy(data, this.createHandler.call(this, path));
    this.preproxy.set(proxy, data);
    return proxy;
  }
}

export default DeepProxy;
