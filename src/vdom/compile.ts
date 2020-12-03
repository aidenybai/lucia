import {
  DIRECTIVE_PREFIX,
  Components,
  View,
  VNodeChild,
  VNodeChildren,
  VNodeTypes,
} from '../defaults';

import { h } from './h';
import props from './utils/props';

const createVNode = (el: HTMLElement, view: View, children: VNodeChildren) => {
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
  return h(el.tagName.toLowerCase(), children, {
    attributes,
    directives,
    ref: type === VNodeTypes.STATIC || attributes.id ? undefined : el,
    type,
  });
};

const compile = (
  el: HTMLElement,
  view: View = {},
  components: Components = {},
  callSelf: boolean = false
): VNodeChildren | VNodeChild => {
  if (!el) throw new Error('Please provide a Element');

  const children: VNodeChildren = [];
  const childNodes = Array.prototype.slice.call(el.childNodes);

  for (const child of childNodes) {
    switch (child.nodeType) {
      case Node.TEXT_NODE:
        if (child.nodeValue) children.push(child.nodeValue);
        break;
      case Node.ELEMENT_NODE:
        // Fill children array
        if (Object.keys(components).includes(child.tagName)) {
          const container = document.createElement('div');
          const template = components[child.tagName]({
            children: child.innerHTML,
            view,
          });

          container.innerHTML = template;

          for (const [key, value] of Object.entries(props(child).directives)) {
            container.firstElementChild?.setAttribute(`${DIRECTIVE_PREFIX}${key}`, value);
          }

          for (const componentChild of compile(
            container,
            view,
            components,
            true
          ) as VNodeChildren) {
            children.push(componentChild);
          }

          el.replaceChild(container.firstElementChild as HTMLElement, child);
        } else {
          children.push(
            createVNode(child, view, compile(child, view, components, true) as VNodeChildren)
          );
        }
        break;
    }
  }

  return callSelf ? children : createVNode(el, view, children);
};

export default compile;
