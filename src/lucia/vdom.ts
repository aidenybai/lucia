export default class VDom {
  $el: any;
  vdom: any;

  constructor($el: any) {
    this.$el = $el;
    this.vdom = this.init(this.$el);
  }

  init($rootEl: any) {
    return this.toVNode($rootEl);
  }

  // lucia.VDom.patch(lucia.VDom.vdom, lucia.Instance.data)
  // doesnt work
  patch(vnodes: any, data: any, iter: any = false): any {
    if (!vnodes) return;
    if (typeof vnodes === 'string') {
      return this.renderTemplates(vnodes, data);
    }

    for (let i = 0; i < vnodes.children.length; i++) {
      if (typeof vnodes.children[i] === 'string') {
        vnodes.children[i] = this.renderTemplates(vnodes.children[i], data);
        if (iter) return vnodes.children[i];
      } else {
        vnodes.children[i] = this.patch(vnodes.children[i], data, true);
      }
      this.patchVNode(vnodes.$el, vnodes, {}, i);
    }
  }

  renderTemplates(html: string, data: any): string {
    const tokens = html.match(/{{\s*(#[^\s\\]+ )?[^\s\\]+.[^\s\\]\s*}}/g) || [];
    for (let i = 0; i < tokens.length; i++) {
      const compressedToken = tokens[i].replace(/(\{)\s*(\S+)\s*(?=})/gim, '$1$2');
      const dataKey = compressedToken.substring(2, compressedToken.length - 2);
      html = html.replace(tokens[i], data[dataKey]);
    }
    return html;
  }

  toVNode($el: any): any {
    let children = [];

    if ($el instanceof Array) {
      // Pretty messy and inconcise, needs to be rewritten
      for (let i = 0; i < $el.length; i++) {
        if ($el[i].children.length === 0) {
          children.push(
            this.h($el[i], $el[i].tagName.toLowerCase(), this.getAttributesObject($el[i]), [
              $el[i].innerHTML,
            ])
          );
        } else {
          children.push(
            this.h(
              $el[i],
              $el[i].tagName.toLowerCase(),
              this.getAttributesObject($el),
              this.toVNode([...$el[i].children])
            )
          );
        }
      }
      return children;
    } else {
      if ($el.children.length === 0) {
        return this.h($el, $el.tagName.toLowerCase(), this.getAttributesObject($el), [
          $el.innerHTML,
        ]);
      } else {
        return this.h(
          $el,
          $el.tagName.toLowerCase(),
          this.getAttributesObject($el),
          this.toVNode([...$el.children])
        );
      }
    }
  }

  getAttributesObject($el: any) {
    const attributesObject: any = {};
    if ($el.attributes) {
      for (const attr of $el.attributes) {
        attributesObject[attr.name] = attr.value; // preprocessing for directives
      }
    }
    return attributesObject;
  }

  h($el: any, tagName: string, attributes: any, children: any) {
    return {
      $el,
      tagName,
      attributes: attributes || {},
      children: children || [],
    };
  }

  createElement(vnode: any) {
    if (typeof vnode === 'string') {
      return document.createTextNode(vnode);
    }
    const $el = document.createElement(vnode.tagName);
    vnode.children.map(this.createElement.bind(this)).forEach($el.appendChild.bind($el));
    Object.keys(vnode.attributes).map((key) => {
      $el.setAttribute(key, vnode.attributes[key]);
    });
    return $el;
  }

  diffVNodes(vnode1: any, vnode2: any) {
    return (
      typeof vnode1 !== typeof vnode2 ||
      (typeof vnode1 === 'string' && vnode1 !== vnode2) ||
      vnode1.tagName !== vnode2.tagName ||
      vnode1.attributes !== vnode2.attributes ||
      vnode1.children !== vnode2.children
    );
  }

  patchVNode($parent: any, newVNode?: any, oldVNode?: any, index: number = 0) {
    if (!$parent) return;
    if (!oldVNode) {
      $parent.appendChild(this.createElement(newVNode));
    } else if (!newVNode) {
      $parent.removeChild($parent.childNodes[index]);
    } else if (this.diffVNodes(newVNode, oldVNode)) {
      $parent.replaceChild(this.createElement(newVNode), $parent.childNodes[index]);
    } else if (newVNode.tagName) {
      const newLength = newVNode.children.length;
      const oldLength = oldVNode.children.length;
      for (let i = 0; i < newLength || i < oldLength; i++) {
        this.patchVNode($parent.childNodes[index], newVNode.children[i], oldVNode.children[i], i);
      }
    }
    // this.toVNode($parent); // NEED CONCISE HYDRATION FOR PERF
  }

  setBooleanProp($target: any, name: any, value: any) {
    if (value) {
      $target.setAttribute(name, value);
      $target[name] = true;
    } else {
      $target[name] = false;
    }
  }

  removeBooleanProp($target: any, name: any) {
    $target.removeAttribute(name);
    $target[name] = false;
  }

  // isEventProp(name: any) {
  //   return /^on/.test(name);
  // }

  // extractEventName(name: any) {
  //   return name.slice(2).toLowerCase();
  // }

  // isCustomProp(name: any) {
  //   return this.isEventProp(name); // can add some type of directive handling here
  // }

  setProp($target: any, name: any, value: any) {
    // if (this.isCustomProp(name)) {
    //   return;
    // } else
    if (typeof value === 'boolean') {
      this.setBooleanProp($target, name, value);
    } else {
      $target.setAttribute(name, value);
    }
  }

  removeProp($target: any, name: any, value: any) {
    // if (this.isCustomProp(name)) {
    //   return;
    // } else
    if (typeof value === 'boolean') {
      this.removeBooleanProp($target, name);
    } else {
      $target.removeAttribute(name);
    }
  }

  setAttributes($target: any, attributes: any) {
    Object.keys(attributes).forEach((name) => {
      this.setProp($target, name, attributes[name]);
    });
  }

  updateProp($target: any, name: any, newVal: any, oldVal: any) {
    if (!newVal) {
      this.removeProp($target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
      this.setProp($target, name, newVal);
    }
  }

  updateAttributes($target: any, newAttributes: any, oldAttributes: any = {}) {
    const attrs = Object.assign({}, newAttributes, oldAttributes);
    Object.keys(attrs).forEach((name) => {
      this.updateProp($target, name, newAttributes[name], oldAttributes[name]);
    });
  }

  // addEventListeners($target: any, props: any) {
  //   Object.keys(props).forEach((name) => {
  //     if (this.isEventProp(name)) {
  //       $target.addEventListener(this.extractEventName(name), props[name]);
  //     }
  //   });
  // }
}
