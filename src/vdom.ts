import compose from './utils/compose';
import instance from './utils/instance';
import getSelector from './utils/getSelector';
import mapAttributes from './utils/mapAttributes';
import { element, textNode } from './utils/helpers';

class VDom {
  $el: any;
  vdom: Record<string, any>;
  data: Function | any;

  constructor($el: HTMLElement, data: Record<string, any>) {
    this.$el = $el;
    this.vdom = this.toVNode(this.$el);
    this.data = instance(data, this.patch.bind(this), this.vdom);
  }

  toVNode($el: any, recurse: boolean = false): any {
    const children = [];
    const targetChildNodes = $el.childNodes;

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
      return element(getSelector($el), $el.tagName.toLowerCase(), mapAttributes($el), children);
    }
  }

  patchTemplates(html: string, data: any): string {
    const tokens = html.match(/{{\s?([^}]*)\s?}}/g) || [];
    for (const token of tokens) {
      const compressedToken = token.replace(/(\{)\s*(\S+)\s*(?=})/gim, '$1$2');
      const rawTemplateData = compressedToken.substring(2, compressedToken.length - 2).trim();

      if (rawTemplateData in data) {
        html = html.replace(token, data[rawTemplateData]);
      } else {
        html = html.replace(token, compose(rawTemplateData, data));
      }
    }
    return html;
  }

  patch(vnodes: any, data: any, recurse: any = false): any {
    if (!vnodes) return;
    if (typeof vnodes === 'string') {
      return this.patchTemplates(vnodes, data);
    }

    for (let i = 0; i < vnodes.children.length; i++) {
      if (vnodes.children[i].$el?.nodeType === Node.TEXT_NODE) {
        const renderedText = this.patchTemplates(vnodes.children[i].value, data);
        if (renderedText !== vnodes.children[i].$el.nodeValue) {
          vnodes.children[i].$el.nodeValue = renderedText;
        }
      } else {
        for (const attr in vnodes.children[i].attributes) {
          const attrValue = vnodes.children[i].attributes[attr];
          const el = document.querySelector(vnodes.children[i].$el);
          el.removeAttribute(attr);

          if (attr === 'l-html') {
            if (compose(attrValue, data) !== undefined) {
              el.innerHTML = compose(attrValue, data);
            } else {
              el.innerHTML = attrValue;
            }
          }

          if (attr === 'l-if') {
            el.hidden = compose(attrValue, data) ? false : true;
          }

          if (attr.startsWith('l-on:')) {
            const eventHandler = () => compose(attrValue, this.data, false);
            el[`on${attr.split(':')[1]}`] = eventHandler;
          }

          if (attr.startsWith('l-bind:')) {
            switch (attr.split(':')[1]) {
              case 'class':
                const classData = compose(attrValue, data);
                if (classData instanceof Array) {
                  el.setAttribute('class', classData.join(' '));
                } else {
                  const classes = [];
                  for (const key in classData) {
                    if (classData[key]) classes.push(key);
                  }
                  if (classes.length > 0) {
                    el.setAttribute('class', classes.join(' '));
                  } else {
                    el.removeAttribute('class');
                  }
                }
                break;
              case 'style':
                const styleData = compose(attrValue, data);
                el.removeAttribute('style');
                for (const key in styleData) {
                  el.style[key] = styleData[key];
                }
                break;
              default:
                el.setAttribute(attr.split(':')[1], compose(attrValue, data));
                break;
            }
          }

          if (attr === 'l-for') {
            const parts = attrValue.split('by ');
            if (compose(parts[0], data) !== undefined) {
              el.innerHTML = compose(parts[0], data).join(parts[1] || '<br>');
            } else {
              el.innerHTML = parts[0].join(parts[1] || '<br>');
            }
          }

          if (attr === 'l-model') {
            el.oninput = () => {
              this.data[attrValue] = el.value;
            };
          }
        }
        vnodes.children[i] = this.patch(vnodes.children[i], data, true);
      }
    }
    if (recurse) return vnodes;
  }
}

export default VDom;
