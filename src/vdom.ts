import noop from './utils/noop';

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

  renderTemplate(html: string, data: any): string {
    const tokens = html.match(/{{\s*.+\s*}}/g) || [];
    for (let i = 0; i < tokens.length; i++) {
      const compressedToken = tokens[i].replace(/(\{)\s*(\S+)\s*(?=})/gim, '$1$2');
      let rawTemplateData = compressedToken.substring(2, compressedToken.length - 2).trim();

      try {
        if (rawTemplateData in data) {
          // Check if only data is provided
          html = html.replace(tokens[i], data[rawTemplateData]);
        } else {
          html = html.replace(tokens[i], this.compose(rawTemplateData, data));
        }
      } catch (err) {
        noop(err);
      }
    }
    return html;
  }

  element($el: any, tagName: string, attributes: any, children: any) {
    return {
      $el,
      tagName,
      attributes: attributes || {},
      children: children || [],
    };
  }

  textNode($el: any, value: string) {
    return {
      $el,
      value,
    };
  }

  toVNode($el: any, iter: boolean = false): any {
    let children = [];

    const targetChildNodes = $el.childNodes;
    for (let i = 0; i < targetChildNodes.length; i++) {
      switch (targetChildNodes[i].nodeType) {
        case Node.TEXT_NODE:
          children.push(this.textNode(targetChildNodes[i], targetChildNodes[i].nodeValue));
          break;
        case Node.ELEMENT_NODE:
          children.push(
            this.element(
              targetChildNodes[i],
              targetChildNodes[i].tagName.toLowerCase(),
              this.getAttributesObject(targetChildNodes[i]),
              this.toVNode(targetChildNodes[i], true)
            )
          );
          break;
      }
    }
    if (iter) return children;
    else {
      return this.element($el, $el.tagName.toLowerCase(), this.getAttributesObject($el), children);
    }
  }

  patch(vnodes: any, data: any, iter: any = false): any {
    if (!vnodes) return;
    if (typeof vnodes === 'string') {
      return this.renderTemplate(vnodes, data);
    }

    for (let i = 0; i < vnodes.children.length; i++) {
      if (vnodes.children[i].$el?.nodeType === Node.TEXT_NODE) {
        // Template
        const renderedText = this.renderTemplate(vnodes.children[i].value, data);
        if (renderedText !== vnodes.children[i].$el.nodeValue) vnodes.children[i].$el.nodeValue = renderedText;
      } else {
        for (const attr in vnodes.children[i].attributes) {
          // Directives
          if (attr.startsWith('l-')) {
            const attrValue = vnodes.children[i].attributes[attr];
            vnodes.children[i].$el.removeAttribute(attr);
            
            if (attr.startsWith('l-on:')) {
              const eventHandler = () => this.compose(attrValue, data);
              vnodes.children[i].$el[`on${attr.split(':')[1]}`] = eventHandler; 
            }
            if (attr === 'l-if') {
              vnodes.children[i].$el.hidden = this.compose(
                vnodes.children[i].attributes[attr],
                data
              )
                ? false
                : true;
            }
            if (attr.startsWith('l-bind:')) {
              switch (attr.split(':')[1]) {
                case 'class':
                  const classData = this.compose(attrValue, data);
                  if (classData instanceof Array) {
                    vnodes.children[i].$el.setAttribute('class', classData.join(' '));
                  } else {
                    const classes = [];
                    for (const key in classData) {
                      if (classData[key]) classes.push(key);
                    }
                    if (classes.length > 0) {
                      vnodes.children[i].$el.setAttribute('class', classes.join(' '));
                    } else {
                      vnodes.children[i].$el.removeAttribute('class');
                    }
                  }
                  break;
                case 'style':
                  const styleData = this.compose(attrValue, data);
                  vnodes.children[i].$el.removeAttribute('style'); // too harsh
                  for (const key in styleData) {
                    vnodes.children[i].$el.style[key] = styleData[key];
                  }
                  break;
                default:
                  vnodes.children[i].$el.setAttribute(
                    attr.split(':')[1],
                    this.compose(attrValue, data)
                  );
                  break;
              }
            }
          }
        }
        vnodes.children[i] = this.patch(vnodes.children[i], data, true);
      }
    }
    if (iter) return vnodes;
  }

  compose(raw: string, data: any) {
    try {
      let payload;
      payload = `(function(){var d=JSON.parse('${JSON.stringify(data)}');`;
      for (const key in data) {
        payload += `var ${key}=d.${key};`;
      }
      payload += `return ${raw}})();`;
      return eval(payload);
    } catch (err) {
      noop(err);
    }
  }

  getAttributesObject($el: any) {
    const attributesObject: any = {};
    if ($el.attributes) {
      for (const attr of $el.attributes) {
        attributesObject[attr.name] = attr.value;
      }
    }
    return attributesObject;
  }
}
