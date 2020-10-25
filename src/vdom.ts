import observer from './observer';
import renderDirective from './directives';
import { getSelector, getProps } from './helpers/selector';

interface VNode {
  tag: string;
  attributes: Record<string, string>;
  directives: Record<string, string>;
  children: Record<string, VNode | string>[];
}

class VDom {
  $vdom: VNode | null;
  $view: ProxyConstructor | Record<string, any> | any;

  constructor(options: Record<string, any>) {
    this.$vdom = null;
    this.$view = options;
  }

  public mount(el: string | Element) {
    this.$vdom = this.$buildVNodeTree(typeof el === 'string' ? document.querySelector(el) : el);
    this.$view = observer(this.$view, this.$patch.bind(this), this.$vdom);

    this.$patch(this.$vdom, Object.keys(this.$view));
    return this.$view;
  }

  public unmount() {
    this.$vdom = null;
    this.$view = null;
  }

  public $createVNode(
    sel: string,
    { tag, attributes = {}, directives = {}, children = [] }: VNode
  ): Record<string, any> {
    return {
      sel,
      tag,
      attributes,
      directives,
      children,
    };
  }

  public $buildVNodeTree(el: Element | null, recurse: boolean = false): Record<any, any> | any {
    if (!el) throw new Error('Please provide a Element');

    const children = [];
    const targetChildNodes = Array.prototype.slice.call(el.childNodes);

    for (const targetChildNode of targetChildNodes) {
      switch (targetChildNode.nodeType) {
        case Node.TEXT_NODE:
          children.push(targetChildNode.nodeValue);
          break;
        case Node.ELEMENT_NODE:
          const { attributes, directives } = getProps(targetChildNode);
          children.push(
            this.$createVNode(getSelector(targetChildNode), {
              tag: targetChildNode.tagName.toLowerCase(),
              attributes,
              directives,
              children: this.$buildVNodeTree(targetChildNode, true),
            })
          );
          break;
      }
    }

    const { attributes, directives } = getProps(el);

    if (recurse) return children;
    else {
      return this.$createVNode(getSelector(el), {
        tag: el.tagName.toLowerCase(),
        attributes,
        directives,
        children,
      });
    }
  }

  public $patch(vnodes: any, keys: any[], recurse: any = false): Record<any, any> | any {
    if (!vnodes) return;

    const view = { ...this.$view };
    for (let i = 0; i < vnodes.children.length; i++) {
      let vnode = vnodes.children[i];
      let { sel, directives, attributes } = vnode;

      if (typeof vnode === 'string') continue;

      const affectedDirectives = [];
      for (const name in directives) {
        const value = directives[name];
        if (
          keys.some((key) => value.toString().includes(key)) ||
          Object.keys(view).some((key: string) => {
            return typeof view[key] === 'function' && view[key].toString().includes(`this.${key}`);
          })
        ) {
          affectedDirectives.push(name);
        }
      }

      if (affectedDirectives.length > 0 && Object.keys(directives).includes('watch')) {
        affectedDirectives.push('watch');
      }

      for (const name of affectedDirectives) {
        const value = directives[name];
        const el = attributes.id
          ? document.getElementById(attributes.id)
          : document.querySelector(sel);

        renderDirective({
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
