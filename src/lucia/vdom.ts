export default class VDom {
  $el: any;
  vdom: any;

  constructor($el: any) {
    this.$el = $el;
    this.vdom = this.compile(this.$el);
  }

  compile($el: any): any {
    let children = [];

    if ($el instanceof Array) {
      // Pretty messy and inconcise, needs to be rewritten
      for (let i = 0; i < $el.length; i++) {
        if ($el[i].children.length === 0) {
          children.push(
            this.h($el[i].tagName.toLowerCase(), this.getPropsObject($el[i]), [$el[i].innerHTML])
          );
        } else {
          children.push(
            this.h(
              $el[i].tagName.toLowerCase(),
              this.getPropsObject($el),
              this.compile([...$el[i].children])
            )
          );
        }
      }
      return children;
    } else {
      if ($el.children.length === 0) {
        return this.h($el.tagName.toLowerCase(), this.getPropsObject($el), [$el.innerHTML]);
      } else {
        return this.h(
          $el.tagName.toLowerCase(),
          this.getPropsObject($el),
          this.compile([...$el.children])
        );
      }
    }
  }

  getPropsObject($el: any) {
    const propsObject: any = {};
    if ($el.props) {
      for (let i = 0; i < $el.props.length; i++) {
        propsObject[$el.props[i].name] = $el.props[i].value;
      }
    }

    return propsObject;
  }

  h(tagName: string, props: any, children: any) {
    return {
      tagName,
      props: props || {},
      children: children || [],
    };
  }

  createElement(node: any) {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    }
    const $el = document.createElement(node.tagName);
    node.children.map(this.createElement.bind(this)).forEach($el.appendChild.bind($el));
    Object.keys(node.props).map((key) => {
      $el.setAttribute(key, node.props[key]);
    });
    return $el;
  }

  diffNodes(node1: any, node2: any) {
    return (
      typeof node1 !== typeof node2 ||
      (typeof node1 === 'string' && node1 !== node2) ||
      node1.tagName !== node2.tagName ||
      node1.props !== node2.props ||
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
    } else if (newNode.tagName) {
      const newLength = newNode.children.length;
      const oldLength = oldNode.children.length;
      for (let i = 0; i < newLength || i < oldLength; i++) {
        this.hydrate($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
      }
    }
    this.compile($parent); // NEED CONCISE HYDRATION FOR PERF
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

  isEventProp(name: any) {
    return /^on/.test(name);
  }

  extractEventName(name: any) {
    return name.slice(2).toLowerCase();
  }

  isCustomProp(name: any) {
    return this.isEventProp(name); // can add some type of directive handling here
  }

  setProp($target: any, name: any, value: any) {
    if (this.isCustomProp(name)) {
      return;
    } else if (typeof value === 'boolean') {
      this.setBooleanProp($target, name, value);
    } else {
      $target.setAttribute(name, value);
    }
  }

  removeProp($target: any, name: any, value: any) {
    if (this.isCustomProp(name)) {
      return;
    } else if (typeof value === 'boolean') {
      this.removeBooleanProp($target, name);
    } else {
      $target.removeAttribute(name);
    }
  }

  setProps($target: any, props: any) {
    Object.keys(props).forEach((name) => {
      this.setProp($target, name, props[name]);
    });
  }

  updateProp($target: any, name: any, newVal: any, oldVal: any) {
    if (!newVal) {
      this.removeProp($target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
      this.setProp($target, name, newVal);
    }
  }

  updateProps($target: any, newProps: any, oldProps: any = {}) {
    const props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach((name) => {
      this.updateProp($target, name, newProps[name], oldProps[name]);
    });
  }

  addEventListeners($target: any, props: any) {
    Object.keys(props).forEach((name) => {
      if (this.isEventProp(name)) {
        $target.addEventListener(this.extractEventName(name), props[name]);
      }
    });
  }
}
