export default class VDom {
  el: any;
  vdom: any;

  constructor(el: any) {
    this.el = el;
    this.vdom = this.generate(this.el);
  }

  generate(el: any): any {
    if (el.length !== 0) {
      let children = [];

      if (el instanceof Array) {
        for (let i = 0; i < el.length; i++) {
          children.push(
            this.h(
              el[i].tagName.toLowerCase(),
              this.getAttributesObject(el[i]),
              this.generate([...el[i].children])
            )
          );
        }
        return children;
      } else {
        return this.h(
          el.tagName.toLowerCase(),
          this.getAttributesObject(el),
          this.generate([...el.children])
        );
      }
    } else {
      return [];
    }
  }

  getAttributesObject(el: any) {
    const attrObject: any = {};
    for (let i = 0; i < el.attributes.length; i++) {
      attrObject[el.attributes[i].name] = el.attributes[i].value;
    }
    return attrObject;
  }

  h(tagName: string, attributes: any, children: any) {
    return {
      tagName,
      attributes: attributes || {},
      children: children || [],
    };
  }

  createElement(node: any) {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    }
    const $el = document.createElement(node.tagName);
    node.children.map(this.createElement).forEach($el.appendChild.bind($el));
    return $el;
  }

  diffNodes(node1: any, node2: any) {
    return (
      typeof node1 !== typeof node2 ||
      (typeof node1 === 'string' && node1 !== node2) ||
      node1.type !== node2.type
    );
  }

  updateElement($parent: any, newNode: any, oldNode: any, index = 0) {
    if (!oldNode) {
      $parent.appendChild(this.createElement(newNode));
    } else if (!newNode) {
      $parent.removeChild($parent.childNodes[index]);
    } else if (this.diffNodes(newNode, oldNode)) {
      $parent.replaceChild(this.createElement(newNode), $parent.childNodes[index]);
    } else if (newNode.type) {
      const newLength = newNode.children.length;
      const oldLength = oldNode.children.length;
      for (let i = 0; i < newLength || i < oldLength; i++) {
        this.updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
      }
    }
  }
}
