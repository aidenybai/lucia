import { props, DIRECTIVE_PREFIX } from './utils/props';
import { h, VNodeTypes, VNode } from './h';
import { safeEval } from './utils/compute';

const createVNode = (el: Element | null, view: Record<string, unknown>, children: VNode[]) => {
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
  return h((el as Element).tagName.toLowerCase(), children, {
    attributes,
    directives,
    ref: type === VNodeTypes.STATIC || attributes.id ? undefined : (el as Element),
    type,
  });
};

const compile = (
  el: Element | null,
  view: Record<string, unknown> = {},
  components: Record<string, Function> = {},
  callSelf: boolean = false
): VNode[] | VNode => {
  if (!el) throw new Error('Please provide a Element');

  const children: VNode[] | VNode = [];
  const childNodes = Array.prototype.slice.call(el.childNodes);

  for (const child of childNodes) {
    switch (child.nodeType) {
      case Node.TEXT_NODE:
        children.push(child.nodeValue);
        break;
      case Node.ELEMENT_NODE:
        // Fill children array
        if (Object.keys(components).includes(child.tagName)) {
          const temp = document.createElement('div');
          temp.innerHTML = components[child.tagName]({
            children: child.innerHTML,
            args: safeEval(`[${child.getAttribute(`${DIRECTIVE_PREFIX}bind`) ?? ''}]`),
            view,
          });

          el.replaceChild(temp, child);

          for (const componentChild of compile(temp, view, components, true) as VNode[]) {
            children.push(componentChild);
          }
        } else {
          children.push(
            createVNode(child, view, compile(child, view, components, true) as VNode[])
          );
        }
        break;
    }
  }

  return callSelf ? children : createVNode(el, view, children);
};

export default compile;
