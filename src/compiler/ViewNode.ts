export default class ViewNode {
  el: any;
  data: string;
  target: string;

  constructor(el: any, data: string, target: string) {
    this.el = el;
    this.data = data;
    this.target = target;
  }
}