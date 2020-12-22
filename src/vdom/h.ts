import { StringKV } from '../models/generics';
import { DirectiveKV } from '../models/structs';
import { VNode, VNodeProps, VNodeChildren } from '../models/vnode';

export const h = (
  tag: string,
  children: VNodeChildren | string = [],
  props?: VNodeProps
): VNode => {
  const attributes: StringKV = { ...props?.attributes };
  const directives: DirectiveKV = { ...props?.directives };

  // If child is is not wrapped in an array, wrap it
  children = children instanceof Array ? children : [children];

  // Remove excessive whitespace
  if (attributes.className) attributes.className = attributes.className.trim();

  return {
    tag,
    children,
    props: {
      attributes,
      directives,
      ref: props?.ref || undefined,
      type: props?.type || 0,
    },
  };
};

export default h;
