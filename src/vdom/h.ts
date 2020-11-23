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

export const VNodeTypes: Record<string, VNodeType> = {
  STATIC: 0, // static VNode (no patching necessary)
  NEEDS_PATCH: 1, // uninitialized static VNode (needs one patch)
  DYNAMIC: 2, // dynamic VNode (needs patch every time view changes)
};

export const h = (tag: string, children?: (VNode | string)[], props?: VNodeProps): VNode => {
  return {
    tag,
    children: children || [],
    props: props || {
      attributes: {},
      directives: {},
      ref: undefined,
      type: 0,
    },
  };
};

export default h;
