import ViewNode from './ViewNode';

export default class ViewManager {
  traverseAttributes(el: any, prefix: string, id: string): any[] {
    const directiveElements: any[] = [];
    const descendents = el.getElementsByTagName('*'); // gets all children of ancestor

    console.log(descendents);

    for (let i = descendents.length - 1; i >= 0; --i) {
      const attr = descendents[i].getAttribute(`${prefix}${id}`);
      if (attr) {
        console.log(attr);
        descendents[i].removeAttributeNode(attr);
        // descendents[i].remove();
        directiveElements.push(new ViewNode(el, attr));
      }
    }

    // for (const child of descendents) {
    //   console.log(child);
    //   if (child.hasAttribute(`${prefix}${id}`)) {
    //     child.removeAttribute(`${prefix}${id}`);
    //     directiveElements.push(new ViewNode(el, child.getAttribute(`${prefix}${id}`)));
    //   }
    // }
 
    // todo: add bindings for elements
    return directiveElements;
  }
}
