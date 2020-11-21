import { h, VNodeTypes, VNode } from './h';
import props from './helpers/props';
import selector from './helpers/selector';

const createVNode = (el: Element | null, view: Record<string, any>, children: VNode[]) => {
  const { attributes, directives } = props(el);
  let type = VNodeTypes.STATIC;

  // Check if there are directives
  const hasDirectives = Object.keys(directives).length > 0;
  // Check if there are affected keys in values
  const hasKeyInDirectives = Object.values(directives).some((value) =>
    Object.keys(view).some((key) => (value as string).includes(key))
  );

  if (hasDirectives) type = VNodeTypes.NEEDS_PATCH;
  if (hasKeyInDirectives) type = VNodeTypes.DYNAMIC;
  return h(
    (el as Element).tagName.toLowerCase(),
    attributes,
    directives,
    children,
    type,
    type === VNodeTypes.STATIC ? undefined : selector(el)
  );
};

const compile = (
  el: Element | null,
  view: Record<string, any> = {},
  callSelf: boolean = false
): Record<any, any> | any => {
  if (!el) throw new Error('Please provide a Element');

  const children = [];
  const childNodes = Array.prototype.slice.call(el.childNodes);

  for (const child of childNodes) {
    switch (child.nodeType) {
      case Node.TEXT_NODE:
        children.push(child.nodeValue);
        break;
      case Node.ELEMENT_NODE:
        // Fill children array
        children.push(createVNode(child, view, compile(child, view, true)));
        break;
    }
  }

  if (callSelf) return children;
  else {
    createVNode(el, view, children);
  }
};

export default compile;
