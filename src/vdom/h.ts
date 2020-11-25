export interface VNode {
  tag: string;
  children: (VNode | string)[];
  props: VNodeProps;
}

export interface VNodeProps {
  ref?: Element;
  type: VNodeType;
  attributes: Record<string, string>;
  directives: Record<string, string>;
}

export type VNodeType = 0 | 1 | 2;

export enum VNodeTypes {
  STATIC = 0,
  NEEDS_PATCH = 1,
  DYNAMIC = 2,
}

export const h = (
  selector: string,
  children?: (VNode | string)[] | string,
  props?: VNodeProps
): VNode => {
  // Splits selector into tokens containing id, className, and other attrs
  const tokens = selector.split(/(?=\.)|(?=#)|(?=\[)/);
  const tag = tokens[0];
  const attributes: Record<string, string> = {
    ...props?.attributes,
  };
  const directives: Record<string, string> = {};

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
          attributes[key] = value;
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
      attributes: attributes,
      directives: props?.directives || directives,
      ref: props?.ref || undefined,
      type: props?.type || 0,
    },
  };
};

export default h;
