import compose from './utils/compose';
import dataStore from './utils/dataStore';
import getSelector from './utils/getSelector';
import { element, textNode } from './utils/helpers';
import mapAttributes from './utils/mapAttributes';

class VDom {
  $el: any;
  vdom: Record<string, any>;
  data: Function | any;

  constructor($el: HTMLElement, data: Record<string, any>) {
    this.$el = $el;
    this.vdom = this.toVNode(this.$el);
    this.data = dataStore(data, this.patch.bind(this), this.vdom);
  }

  patchTemplates(html: string, data: any): string {
    const tokens = html.match(/{{\s?([^}]*)\s?}}/g) || [];
    for (let i = 0; i < tokens.length; i++) {
      const compressedToken = tokens[i].replace(/(\{)\s*(\S+)\s*(?=})/gim, '$1$2');
      let rawTemplateData = compressedToken.substring(2, compressedToken.length - 2).trim();

      if (rawTemplateData in data) {
        // Check if only data is provided
        html = html.replace(tokens[i], data[rawTemplateData]);
      } else {
        html = html.replace(tokens[i], compose(rawTemplateData, data));
      }
    }
    return html;
  }

  toVNode($el: any, iter: boolean = false): any {
    let children = [];

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
    if (iter) return children;
    else {
      return element(getSelector($el), $el.tagName.toLowerCase(), mapAttributes($el), children);
    }
  }

  patch(vnodes: any, data: any, iter: any = false): any {
    if (!vnodes) return;
    if (typeof vnodes === 'string') {
      return this.patchTemplates(vnodes, data);
    }

    for (let i = 0; i < vnodes.children.length; i++) {
      if (vnodes.children[i].$el?.nodeType === Node.TEXT_NODE) {
        // Template
        const renderedText = this.patchTemplates(vnodes.children[i].value, data);
        if (renderedText !== vnodes.children[i].$el.nodeValue) {
          vnodes.children[i].$el.nodeValue = renderedText;
        }
      } else {
        for (const attr in vnodes.children[i].attributes) {
          // Directives
          const attrValue = vnodes.children[i].attributes[attr];
          document.querySelector(vnodes.children[i].$el).removeAttribute(attr);

          if (attr.startsWith('l-on:')) {
            const eventHandler = () => compose(attrValue, this.data, false);
            document.querySelector(vnodes.children[i].$el)[
              `on${attr.split(':')[1]}`
            ] = eventHandler;
          }
          if (attr === 'l-if') {
            document.querySelector(vnodes.children[i].$el).hidden = compose(
              vnodes.children[i].attributes[attr],
              data
            )
              ? false
              : true;
          }
          if (attr === 'l-html') {
            if (compose(vnodes.children[i].attributes[attr], data) !== undefined) {
              document.querySelector(vnodes.children[i].$el).innerHTML = compose(
                vnodes.children[i].attributes[attr],
                data
              );
            } else {
              document.querySelector(vnodes.children[i].$el).innerHTML =
                vnodes.children[i].attributes[attr];
            }
          }
          if (attr === 'l-for') {
            if (compose(vnodes.children[i].attributes[attr], data) !== undefined) {
              document.querySelector(vnodes.children[i].$el).innerHTML = compose(
                vnodes.children[i].attributes[attr],
                data
              ).join('<br>');
            } else {
              document.querySelector(vnodes.children[i].$el).innerHTML = vnodes.children[
                i
              ].attributes[attr].join('<br>');
            }
          }
          if (attr === 'l-model') {
            document.querySelector(vnodes.children[i].$el).oninput = () => {
              this.data[vnodes.children[i].attributes[attr]] = document.querySelector(
                vnodes.children[i].$el
              ).value;
            };
          }
          if (attr.startsWith('l-bind:')) {
            switch (attr.split(':')[1]) {
              case 'class':
                const classData = compose(attrValue, data);
                if (classData instanceof Array) {
                  document
                    .querySelector(vnodes.children[i].$el)
                    .setAttribute('class', classData.join(' '));
                } else {
                  const classes = [];
                  for (const key in classData) {
                    if (classData[key]) classes.push(key);
                  }
                  if (classes.length > 0) {
                    document
                      .querySelector(vnodes.children[i].$el)
                      .setAttribute('class', classes.join(' '));
                  } else {
                    document.querySelector(vnodes.children[i].$el).removeAttribute('class');
                  }
                }
                break;
              case 'style':
                const styleData = compose(attrValue, data);
                document.querySelector(vnodes.children[i].$el).removeAttribute('style'); // too harsh
                for (const key in styleData) {
                  document.querySelector(vnodes.children[i].$el).style[key] = styleData[key];
                }
                break;
              default:
                document
                  .querySelector(vnodes.children[i].$el)
                  .setAttribute(attr.split(':')[1], compose(attrValue, data));
                break;
            }
          }
        }
        vnodes.children[i] = this.patch(vnodes.children[i], data, true);
      }
    }
    if (iter) return vnodes;
  }
}

export default VDom;
