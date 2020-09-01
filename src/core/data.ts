export default class Data {
  data: any;

  constructor(data: any, paint: any) {
    this.data = new Proxy(data, {
      set(target, key, value) {
        target[key] = value;
        paint();
        return true;
      },
      deleteProperty(target, key) {
        delete target[key];
        paint();
        return true;
      },
    });
  }
}
