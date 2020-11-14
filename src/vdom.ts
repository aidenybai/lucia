import observer from './observer';
import renderDirective from './directives';
import { getSelector, getProps } from './helpers/selector';
import { VNode } from './helpers/interfaces';

class VDom {
  $vdom: VNode | null;
  $view: ProxyConstructor | Record<string, any> | any;

  constructor(options: Record<string, any>) {
    this.$vdom = null;
    this.$view = options;
  }

  public mount(el: string | Element) {
    this.$vdom = this.compile(typeof el === 'string' ? document.querySelector(el) : el);
    this.$view = observer(this.$view, this.patch.bind(this), this.$vdom);

    this.patch(this.$vdom, Object.keys(this.$view));
    return this.$view;
  }

  public h(
    tag: string,
    attributes: Record<string, string> = {},
    directives: Record<string, string> = {},
    children: Record<string, VNode | string>[] = [],
    type: number,
    sel?: string
  ): VNode {
    return {
      tag,
      data: {
        sel,
        attributes,
        directives,
      },
      children,
      type,
    };
  }

  public compile(el: Element | null, callSelf: boolean = false): Record<any, any> | any {
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
          let type = 0;
          // Check if there are directives
          type = Object.keys(directives).length === 0 ? type : 1;
          // Check if there are affected keys in values
          type = !Object.values(directives).some((value) =>
            Object.keys(this.$view).some((key) => (value as string).includes(key))
          )
            ? type
            : 2;
          children.push(
            this.h(
              targetChildNode.tagName.toLowerCase(),
              attributes,
              directives,
              this.compile(targetChildNode, true),
              type,
              getSelector(targetChildNode)
            )
          );

          break;
      }
    }

    const { attributes, directives } = getProps(el);

    if (callSelf) return children;
    else {
      let type = 0;
      // Check if there are directives
      type = Object.keys(directives).length === 0 ? type : 1;
      // Check if there are affected keys in values
      type = !Object.values(directives).some((value) =>
        Object.keys(this.$view).some((key) => (value as string).includes(key))
      )
        ? type
        : 2;
      return this.h(
        el.tagName.toLowerCase(),
        attributes,
        directives,
        children,
        type,
        getSelector(el)
      );
    }
  }

  public patch(
    vnodes: any /* VNode | null */,
    keys: string[] = [],
    callSelf: boolean = false
  ): Record<any, any> | any {
    if (!vnodes) return;

    const view = { ...this.$view };
    for (let i = 0; i < vnodes.children.length; i++) {
      let vnode = vnodes.children[i];
      if (typeof vnode === 'string') continue;

      if (vnode.type > 0) {
        const { attributes, directives, sel } = vnode.data;
        const affectedDirectives = [];
        for (const name in directives as any) {
          const value = directives[name];
          if (
            keys.some((key) => value.toString().includes(key)) ||
            Object.keys(view).some((key: string) => {
              return (
                typeof view[key] === 'function' &&
                keys.some((k) => view[key].toString().includes(`this.${k}`))
              );
            })
          ) {
            affectedDirectives.push(name);
          }
        }

        if (affectedDirectives.length > 0 && Object.keys(directives).includes('on:effect')) {
          affectedDirectives.push('on:effect'); // Probably should make this more efficient in the future
        }

        if (vnode.type === 1) {
          vnode.type = 0;
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
      }

      vnode = this.patch(vnode, keys, true);
    }
    if (callSelf) return vnodes;
  }
}

export default VDom;
