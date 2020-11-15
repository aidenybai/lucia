export interface VNode {
  tag: string;
  data: VNodeData;
  children: Record<string, VNode | string>[];
  /*
   * type: 0 - static VNode (no patching necessary)
   * type: 1 - uninitialized static VNode (needs one patch)
   * type: 2 - dynamic VNode (needs patch every time view changes)
   */
  type: number;
}

export interface VNodeData {
  sel?: string;
  attributes: Record<string, string>;
  directives: Record<string, string>;
}

export const h = (
  tag: string,
  attributes: Record<string, string> = {},
  directives: Record<string, string> = {},
  children: Record<string, VNode | string>[] = [],
  type: number = 0,
  sel?: string
): VNode => {
  return {
    tag,
    data: {
      sel,
      attributes,
      directives,
    },
    children,
    type,
  };
};

export default h;
