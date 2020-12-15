import { DIRECTIVE_PREFIX, StringKV } from '../models/generics';
import { VNode, VNodeProps, VNodeChildren } from '../models/vnode';

import { selectorSplitPattern } from './utils/patterns';

export const h = (
  selector: string,
  children?: VNodeChildren | string,
  props?: VNodeProps
): VNode => {
  // Splits selector into tokens containing id, className, and other attrs
  const tokens = selector.split(selectorSplitPattern);
  const tag = tokens[0];
  const attributes: StringKV = { ...props?.attributes };
  const directives: StringKV = { ...props?.directives };

  if (tokens.length > 1) {
    tokens.shift();

    for (const token of tokens) {
      switch (token[0]) {
        case '#':
          attributes.id = token.slice(1);
          break;
        case '.':
          if (!attributes.className) attributes.className = '';
          attributes.className += `${token.slice(1)} `;
          break;
        case '[':
          const [key, value] = token.slice(1, -1).split('=');
          if (key.startsWith(DIRECTIVE_PREFIX)) {
            directives[key.slice(DIRECTIVE_PREFIX.length)] = value;
          } else {
            attributes[key] = value;
          }
          break;
      }
    }
  }

  // Trim off trailing space
  if (attributes.className) attributes.className = attributes.className.trim();

  return {
    tag,
    children: typeof children === 'string' ? [children] : children ? children : [],
    props: {
      attributes,
      directives,
      ref: props?.ref || undefined,
      type: props?.type || 0,
    },
  };
};

export default h;
