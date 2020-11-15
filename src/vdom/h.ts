export interface VNode {
  tag: string;
  props: VNodeProps;
  children: (VNode | string)[];
  type: number;
}

export interface VNodeProps {
  sel?: string;
  attributes: Record<string, string>;
  directives: Record<string, string>;
}

export const VNodeTypes = {
  STATIC: 0, // static VNode (no patching necessary)
  NEEDS_PATCH: 1, // uninitialized static VNode (needs one patch)
  DYNAMIC: 2, // dynamic VNode (needs patch every time view changes)
};

export const h = (
  tag: string,
  attributes: Record<string, string> = {},
  directives: Record<string, string> = {},
  children: (VNode | string)[] = [],
  type: number = 0,
  sel?: string
): VNode => {
  return {
    tag,
    props: {
      attributes,
      directives,
      sel,
    },
    children,
    type,
  };
};

export default h;
