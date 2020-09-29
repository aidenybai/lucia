import observer from './observer';
import renderDirectives from './directives';
import { getSelector, mapAttributes } from './helpers/selector';

class VDom {
  $el: any;
  $vdom: Record<string, any> | null;
  $view: ProxyConstructor | Record<string, any> | any;

  constructor(data: Record<string, any>) {
    this.$el = null;
    this.$vdom = null;
    this.$view = data;
  }

  public mount(el: string | HTMLElement) {
    this.$el = typeof el === 'string' ? document.querySelector(el) : el;
    this.$vdom = this.$buildVNode(this.$el);
    this.$view = observer(this.$view, this.$patch.bind(this), this.$vdom);

    this.$patch(this.$vdom, Object.keys(this.$view));
    return { ...this.$view, $vdom: this.$vdom, $el: this.$el };
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

  public $patch(vnodes: any, keys: string[], recurse: any = false): Record<any, any> | any {
    if (!vnodes) return;

    for (let i = 0; i < vnodes.children.length; i++) {
      let vnode,
        { el: rootEl, directives } = vnodes.children[i];

      if (typeof vnode === 'string') continue;
      for (const name in directives) {
        const value = directives[name];
        let necessaryToRender = false;

        for (const key of keys) {
          if (value.includes(key)) {
            necessaryToRender = true;
            break;
          }
        }

        if (!necessaryToRender) continue;

        const el = document.querySelector(rootEl);
        try {
          el.removeAttribute(`*${name}`);
        } catch (err) {}

        renderDirectives({
          el,
          name,
          value,
          view: this.$view,
        });
      }
      vnode = this.$patch(vnode, keys, true);
    }
    if (recurse) return vnodes;
  }
}

export default VDom;
