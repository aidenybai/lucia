import h from './h';
import getProps from '../helpers/props';
import { getSelector } from '../helpers/selector';

const compile = (
  el: Element | null,
  view: Record<string, any>,
  callSelf: boolean = false
): Record<any, any> | any => {
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
          Object.keys(view).some((key) => (value as string).includes(key))
        )
          ? type
          : 2;
        children.push(
          h(
            targetChildNode.tagName.toLowerCase(),
            attributes,
            directives,
            compile(targetChildNode, view, true),
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
      Object.keys(view).some((key) => (value as string).includes(key))
    )
      ? type
      : 2;
    return h(el.tagName.toLowerCase(), attributes, directives, children, type, getSelector(el));
  }
};

export default compile;
