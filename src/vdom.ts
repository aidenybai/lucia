import observer from './utils/observer';
import renderDirectives from './directives';
import { getSelector, mapAttributes } from './utils/domUtils';

class VDom {
  $el: any;
  $vdom: Record<string, any> | null;
  $data: ProxyConstructor | Record<string, any> | any;

  constructor(data: Record<string, any>) {
    this.$el = null;
    this.$vdom = null;
    this.$data = data;
  }

  public mount(el?: string) {
    this.$el = document.querySelector(el || '#app' || 'body');
    this.$vdom = this.$buildVNode(this.$el);
    this.$data = observer(this.$data, this.$patch.bind(this), this.$vdom);

    this.$patch(this.$vdom, this.$data);
    return this.$data;
  }

  public $createVNode(
    el: string,
    {
      tagName,
      attributes = {},
      directives = {},
      children = [],
    }: {
      tagName: string;
      attributes: any;
      directives: any;
      children: any[];
    }
  ): Record<string, any> {
    return {
      el,
      tagName,
      attributes,
      directives,
      children,
    };
  }

  public $buildVNode(el: any, recurse: boolean = false): Record<any, any> | any {
    const children = [];
    const targetChildNodes = el.childNodes;

    for (const targetChildNode of targetChildNodes) {
      switch (targetChildNode.nodeType) {
        case Node.TEXT_NODE:
          children.push(targetChildNode.nodeValue);
          break;
        case Node.ELEMENT_NODE:
          const { attributes, directives } = mapAttributes(targetChildNode);
          children.push(
            this.$createVNode(getSelector(targetChildNode), {
              tagName: targetChildNode.tagName.toLowerCase(),
              attributes,
              directives,
              children: this.$buildVNode(targetChildNode, true),
            })
          );
          break;
      }
    }

    const { attributes, directives } = mapAttributes(el);

    if (recurse) return children;
    else {
      return this.$createVNode(getSelector(el), {
        tagName: el.tagName.toLowerCase(),
        attributes,
        directives,
        children,
      });
    }
  }

  public $patch(vnodes: any, recurse: any = false): Record<any, any> | any {
    if (!vnodes) return;

    for (let i = 0; i < vnodes.children.length; i++) {
      let vnode,
        { el: rootEl, directives } = vnodes.children[i];

      for (const name in directives) {
        if (typeof vnode === 'string') continue;

        const value = directives[name];
        const el = document.querySelector(rootEl);
        el.removeAttribute(`*${name}`);

        renderDirectives({
          // Make this only render data that is necessary
          el,
          name,
          value,
          data: this.$data,
        });
      }
      vnode = this.$patch(vnode, true);
    }
    if (recurse) return vnodes;
  }
}

export default VDom;
