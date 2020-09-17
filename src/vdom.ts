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

  public mount(el: string, mounted?: Function | any) {
    this.$el = document.querySelector(el || '#app' || 'body');
    this.$vdom = this.toVNode(this.$el);
    this.$data = observer(this.$data, this.patch.bind(this), this.$vdom);
    this.patch(this.$vdom, this.$data);
    if (mounted) mounted(this.$data);
  }

  public patch(vnodes: any, data: any, recurse: any = false): Record<any, any> | any {
    if (!vnodes) return;
    if (typeof vnodes === 'string') {
      return this.patchTemplates(vnodes, data);
    }

    for (let i = 0; i < vnodes.children.length; i++) {
      if (vnodes.children[i].el?.nodeType === Node.TEXT_NODE) {
        const renderedText = this.patchTemplates(vnodes.children[i].value, data);
        if (renderedText !== vnodes.children[i].el.nodeValue) {
          vnodes.children[i].el.nodeValue = renderedText;
        }
      } else {
        for (const attr in vnodes.children[i].attributes) {
          const value = vnodes.children[i].attributes[attr];
          const el = document.querySelector(vnodes.children[i].el);
          el.removeAttribute(attr);

          directives({
            directive: attr.replace('*', ''),
            el,
            attr,
            value,
            data: this.$data,
          });
        }
        vnodes.children[i] = this.patch(vnodes.children[i], data, true);
      }
    }
    if (recurse) return vnodes;
  }

  private patchTemplates(html: string, data: ProxyConstructor | any): string {
    const tokens = html.match(/{{\s?([^}]*)\s?}}/g) || [];
    for (const token of tokens) {
      const compressedToken = token.replace(/(\{)\s*(\S+)\s*(?=})/gim, '$1$2');
      const rawTemplateData = compressedToken.substring(2, compressedToken.length - 2).trim();

      if (rawTemplateData in data) {
        html = html.replace(token, data[rawTemplateData]);
      } else {
        html = html.replace(token, compute(rawTemplateData, data));
      }
    }
    return html;
  }

  private toVNode(el: any, recurse: boolean = false): Record<any, any> | any {
    const children = [];
    const targetChildNodes = el.childNodes;

    for (let i = 0; i < targetChildNodes.length; i++) {
      switch (targetChildNodes[i].nodeType) {
        case Node.TEXT_NODE:
          children.push(textNode(targetChildNodes[i], targetChildNodes[i].nodeValue));
          break;
        case Node.ELEMENT_NODE:
          children.push(
            element(
              getSelector(targetChildNodes[i]),
              targetChildNodes[i].tagName.toLowerCase(),
              mapAttributes(targetChildNodes[i]),
              this.toVNode(targetChildNodes[i], true)
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
