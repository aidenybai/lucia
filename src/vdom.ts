import directives from './directives';
import compute from './utils/compute';
import observer from './utils/observer';
import { getSelector, mapAttributes } from './utils/domUtils';
import { element, textNode } from './utils/helpers';

class VDom {
  $el: any;
  $vdom: Record<string, any> | null;
  $data: ProxyConstructor | Record<string, any> | any;

  constructor(data: Record<string, any>) {
    this.$el = null;
    this.$vdom = null;
    this.$data = data;
  }

  public mount(el?: string, mounted?: Function | any) {
    this.$el = document.querySelector(el || '#app' || 'body');
    this.$vdom = this.$buildVNode(this.$el);
    this.$data = observer(this.$data, this.$patch.bind(this), this.$vdom);

    this.$patch(this.$vdom, this.$data);
    if (mounted) mounted(this.$data);
  }

  public $patch(vnodes: any, data: any, recurse: any = false): Record<any, any> | any {
    if (!vnodes) return;
    // if (typeof vnodes === 'string') {
    //   return this.$patchTemplates(vnodes, data);
    // }

    // Change text node to just string, create h func vdom that buildvnodes generates, make a new directives alongside attr and children for persist storage and rendering

    // {
    //   tagName,
    //   directives,
    //   attributes,
    //   children
    // } vdom diffing

    for (let i = 0; i < vnodes.children.length; i++) {
      let vnode,
        { el, attributes, value } = vnodes.children[i];

      if (el.nodeType === Node.TEXT_NODE) {
        const renderedText = this.$patchTemplates(value, data);

        if (el.nodeValue !== renderedText) {
          el.nodeValue = renderedText;
        }
      } else {
        for (const name in attributes) {
          const value = attributes[name];
          el = document.querySelector(el);

          directives({
            directive: name.replace('*', ''),
            el,
            name,
            value,
            data: this.$data,
          });

          el.removeAttribute(name);
        }
        vnode = this.$patch(vnode, data, true);
      }
    }
    if (recurse) return vnodes;
  }

  public $patchTemplates(content: string, data: ProxyConstructor | any): string {
    const tokens = content.match(/{{\s?([^}]*)\s?}}/g) || [];
    for (const token of tokens) {
      const compressedToken = token.replace(/(\{)\s*(\S+)\s*(?=})/gim, '$1$2');
      const rawTemplateData = compressedToken.substring(2, compressedToken.length - 2).trim();

      if (rawTemplateData in data) {
        content = content.replace(token, data[rawTemplateData]);
      } else {
        content = content.replace(token, compute(rawTemplateData, data));
      }
    }
    return content;
  }

  public $buildVNode(el: any, recurse: boolean = false): Record<any, any> | any {
    const children = [];
    const targetChildNodes = el.childNodes;

    for (const targetChildNode of targetChildNodes) {
      switch (targetChildNode.nodeType) {
        case Node.TEXT_NODE:
          children.push(textNode(targetChildNode, targetChildNode.nodeValue));
          break;
        case Node.ELEMENT_NODE:
          children.push(
            element(
              getSelector(targetChildNode),
              targetChildNode.tagName.toLowerCase(),
              mapAttributes(targetChildNode),
              this.$buildVNode(targetChildNode, true)
            )
          );
          break;
      }
    }

    if (recurse) return children;
    else {
      return element(getSelector(el), el.tagName.toLowerCase(), mapAttributes(el), children);
    }
  }
}

export default VDom;
