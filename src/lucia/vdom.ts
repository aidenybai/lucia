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
      // Need to implement composition API
      let templateData = compressedToken.substring(2, compressedToken.length - 2).trim();

      try {
        if (templateData in data) {
          html = html.replace(tokens[i], data[templateData]);
        } else {
          // mega sketch composition api but it works

          html = html.replace(tokens[i], this.compose(templateData, data));
        }
      } catch (err) {
        console.log(err);
      }
    }
    return html;
  }

  element(node: any, tagName: string, attributes: any, children: any) {
    return {
      node,
      tagName,
      attributes: attributes || {},
      children: children || [],
    };
  }

  textNode(node: any, value: string) {
    return {
      node,
      value,
    };
  }

  toVNode($el: any, iter: boolean = false): any {
    let children = [];

    const targetChildNodes = $el.childNodes;
    for (let i = 0; i < targetChildNodes.length; i++) {
      // Ignored:
      // CDATA_SECTION_NODE
      // PROCESSING_INSTRUCTION_NODE
      // COMMENT_NODE
      // DOCUMENT_NODE
      // DOCUMENT_TYPE_NODE
      // DOCUMENT_FRAGMENT_NODE
      if (targetChildNodes[i].nodeType === Node.TEXT_NODE) {
        children.push(this.textNode(targetChildNodes[i], targetChildNodes[i].nodeValue));
      } else if (targetChildNodes[i].nodeType === Node.ELEMENT_NODE) {
        children.push(
          this.element(
            targetChildNodes[i],
            targetChildNodes[i].tagName.toLowerCase(),
            this.getAttributesObject(targetChildNodes[i]),
            this.toVNode(targetChildNodes[i], true)
          )
        );
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
      if (vnodes.children[i].node?.nodeType === Node.TEXT_NODE) {
        // Template
        vnodes.children[i].node.nodeValue = this.renderTemplate(vnodes.children[i].value, data); // possible error point?
      } else {
        for (const attr in vnodes.children[i].attributes) {
          // Directives
          if (attr.startsWith('l-')) {
            vnodes.children[i].node.removeAttribute(attr);
            if (attr.startsWith('l-on:')) {
              const eventHandler = () => this.compose(vnodes.children[i].attributes[attr], data); // Need to implement composition API
              vnodes.children[i].node[`on${attr.split(':')[1]}`] = eventHandler; // probably should have addEventListener - but need to make it single somehow.
            }
          }
        }
        vnodes.children[i] = this.patch(vnodes.children[i], data, true);
      }
    }
    if (iter) return vnodes;
  }

  compose(raw: string, data: any) {
    let evalString = `(() => { let _luciaPrivData = JSON.parse('${JSON.stringify(data)}'); `;
    for (const key in data) {
      evalString += `let ${key} = _luciaPrivData.${key}; `;
    }
    evalString += `return ${raw}; })();`;
    return eval(evalString);
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
 