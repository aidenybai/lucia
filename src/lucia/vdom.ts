export default class VDom {
  el: any;
  vdom: any;

  constructor(el: any) {
    this.el = el;
    this.vdom = this.generate(this.el);
  }

  generate(el: any): any {
    let children = [];

    if (el instanceof Array) {
      for (let i = 0; i < el.length; i++) {
        if (el[i].children.length === 0) {
          children.push(
            this.h(el[i].tagName.toLowerCase(), this.getAttributesObject(el[i]), [el[i].innerHTML])
          );
        } else {
          children.push(
            this.h(
              el[i].tagName.toLowerCase(),
              this.getAttributesObject(el),
              this.generate([...el[i].children])
            )
          );
        }
      }
      return children;
    } else {
      if (el.children.length === 0) {
        return this.h(el.tagName.toLowerCase(), this.getAttributesObject(el), [el.innerHTML]);
      } else {
        return this.h(
          el.tagName.toLowerCase(),
          this.getAttributesObject(el),
          this.generate([...el.children])
        );
      }
    }
  }

  getAttributesObject(el: any) {
    const attrObject: any = {};
    if (el.attributes) {
      for (let i = 0; i < el.attributes.length; i++) {
        attrObject[el.attributes[i].name] = el.attributes[i].value;
      }
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
    node.children.map(this.createElement.bind(this)).forEach($el.appendChild.bind($el));
    Object.keys(node.attributes).map((key) => {
      $el.setAttribute(key, node.attributes[key]);
    });
    return $el;
  }

  diffNodes(node1: any, node2: any) {
    return (
      typeof node1 !== typeof node2 ||
      (typeof node1 === 'string' && node1 !== node2) ||
      node1.tagName !== node2.tagName ||
      node1.attributes !== node2.attributes ||
      node1.children !== node2.children 
    );
  }

  hydrate($parent: any, newNode: any, oldNode: any, index = 0) {
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
        this.hydrate($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
      }
    }
    this.generate(this.el); // NEED CONCISE HYDRATION
  }
}
