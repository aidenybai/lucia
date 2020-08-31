export default class Data {
  data: any;

  constructor(data: any) {
    this.data = data;
  }

  has(key: string): boolean {
    return key in this.data;
  }

  get(key: string): any {
    return this.data[key];
  }

  set(key: string, value: any): void {
    this.data[key] = value;
  }

  delete(key: string): void {
    this.data[key] = '';
  }
}
