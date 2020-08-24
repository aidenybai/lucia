export default class ViewNode {
  el: any;
  data: string;

  constructor(el: any, data: string) {
    this.el = el;
    this.data = data;
  }
}