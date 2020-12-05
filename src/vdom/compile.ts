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

type CompileGroup = Record<string, VNodeChildren | VNodeChild | boolean>;

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
  strip: boolean = false,
  callSelf: boolean = false
): VNodeChildren | VNodeChild | CompileGroup => {
  if (!el) throw new Error('Please provide a Element');

  // Dynamic group propogates up the tree, marked as true only if a child is dynamic
  let isDynamicGroup = !strip;

  const children: VNodeChildren = [];
  const childNodes = Array.prototype.slice.call(el.childNodes);

  for (const child of childNodes) {
    switch (child.nodeType) {
      case Node.TEXT_NODE:
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
            container.firstElementChild?.setAttribute(`${DIRECTIVE_PREFIX}${key}`, value);
          }

          const childrenCompileGroup = compile(
            container,
            view,
            components,
            strip,
            true
          ) as CompileGroup;

          if (childrenCompileGroup.isDynamicGroup) {
            // Check if children group has isDynamicGroup prop, which returns true when
            // children have dynamic nodes.
            for (const componentChild of childrenCompileGroup.children as VNodeChildren) {
              isDynamicGroup = true;
              // Push only if dynamic
              children.push(componentChild);
            }
          }

          el.replaceChild(container.firstElementChild as HTMLElement, child);
        } else {
          const childrenCompileGroup = compile(
            child,
            view,
            components,
            strip,
            true
          ) as CompileGroup;
          const node = createVNode(child, view, childrenCompileGroup.children as VNodeChildren);
          // Check if contains dynamic group or is non-static
          if (node.props.type !== 0 || childrenCompileGroup.isDynamicGroup) {
            isDynamicGroup = true;
            children.push(node);
          }
        }
        break;
    }
  }

  return callSelf ? { children, isDynamicGroup } : createVNode(el, view, children);
};

export default compile;
