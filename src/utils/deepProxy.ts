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

  unproxy(obj: Record<any, any>, key: string): void {
    if (this.preproxy.has(obj[key])) {
      obj[key] = this.preproxy.get(obj[key]);
      this.preproxy.delete(obj[key]);
    }

    for (let k of Object.keys(obj[key])) {
      if (typeof obj[key][k] === 'object') {
        this.unproxy(obj[key], k);
      }
    }
  }

  proxify(obj: Record<any, any>, path: any[]): Record<any, any> {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object') {
        obj[key] = this.proxify(obj[key], [...path, key]);
      }
    }

    const proxy = new Proxy(obj, this.createHandler.call(this, path));
    this.preproxy.set(proxy, obj);
    return proxy;
  }
}

export default DeepProxy;
