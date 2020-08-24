import ViewNode from './ViewNode';

export default class ViewManager {
  traverseAttributes(el: any, prefix: string, id: string): any[] {
    const directiveElements: any[] = [];
    const descendents = el.getElementsByTagName('*'); // gets all children of ancestor

    for (let i = descendents.length - 1; i >= 0; --i) {
      const attr = descendents[i].getAttribute(`${prefix}${id}`);
      if (attr) {
        descendents[i].removeAttribute(`${prefix}${id}`);
        directiveElements.push(new ViewNode(el, attr));
      }
    }
 
    // todo: add bindings for elements
    return directiveElements;
  }
}
