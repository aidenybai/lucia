import { DIRECTIVE_PREFIX } from '../models/generics';
import { Components, View } from '../models/structs';
import { VNode, VNodeChild, VNodeChildren, VNodeTypes } from '../models/vnode';

import { h } from './h';
import props from './utils/props';
import keyPattern from './utils/keyPattern';

export const createVNode = (el: HTMLElement, view: View, children: VNodeChildren) => {
  const { attributes, directives } = props(el);
  let type = VNodeTypes.STATIC;

  // Check if there are directives
  const hasDirectives = Object.keys(directives).length > 0;
  // Check if there are affected keys in values
  const hasKeyInDirectives = Object.values(directives).some((value) =>
    Object.keys(view).some((key) => keyPattern(key, false).test(value as string))
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

export const compile = (
  el: HTMLElement,
  view: View = {},
  components: Components = {},
  strip: boolean = false,
  callSelf: boolean = false
): VNodeChildren | VNodeChild => {
  if (!el) throw new Error('Please provide a Element');

  // Dynamic group propogates up the tree, marked as true only if a child is dynamic

  const children: VNodeChildren = [];
  const childNodes = Array.prototype.slice.call(el.childNodes);

  for (const child of childNodes) {
    switch (child.nodeType) {
      case Node.TEXT_NODE:
        // Only push string if not stripped
        if (!strip && child.nodeValue) {
          children.push(child.nodeValue);
        }
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

          // Grab all the directives on the custom component element
          for (const [key, value] of Object.entries(props(child).directives)) {
            container.firstElementChild?.setAttribute(`${DIRECTIVE_PREFIX}${key}`, value as string);
          }

          // Only allow during strip if outerHTML has directives
          if (!strip || child.outerHTML.includes(` ${DIRECTIVE_PREFIX}`)) {
            const compiledChildren = compile(container, view, components, strip, true);
            // Check if children group has isDynamicGroup prop, which returns true when
            // children have dynamic nodes
            for (const componentChild of compiledChildren as VNodeChildren) {
              // Push only if dynamic
              children.push(componentChild);
            }
          }

          el.replaceChild(container.firstElementChild as HTMLElement, child);
        } else {
          // Only allow during strip if outerHTML has directives
          if (!strip || child.outerHTML.includes(` ${DIRECTIVE_PREFIX}`)) {
            const compiledChildren = compile(child, view, components, strip, true);
            const node = createVNode(child, view, compiledChildren as VNodeChildren);
            children.push(node);
          }
        }
        break;
    }
  }

  if (callSelf) {
    return children;
  } else {
    let vnode = createVNode(el, view, children);
    return strip ? flat(vnode) : vnode;
  }
};

export const flat = (vdom: VNode): VNode => {
  const flattenedVDom = { ...vdom };
  // Clone vdom and remove all the non-dynamic nodes
  flattenedVDom.children.filter((child) => typeof child === 'object' && child.props.type > 0);

  for (const child of vdom.children) {
    // Iterate down the children and push to parent child array clone if dynamic
    if (typeof child === 'string') continue;
    if (child.children.length > 0) {
      for (const nestedChild of flat(child).children) {
        if (typeof nestedChild === 'string') continue;
        if (nestedChild.props.type !== 0) {
          flattenedVDom.children.push(nestedChild);
        }
      }
    }
  }

  return flattenedVDom;
};

export default compile;
