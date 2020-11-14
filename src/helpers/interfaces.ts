export interface directiveArgs {
  el: HTMLElement | any;
  name: string;
  value: string | any;
  view: Record<string, any>;
}

export interface VNode {
  tag: string;
  data: VNodeData;
  children: Record<string, VNode | string>[];
  type: number; // Can be 0: static, 1: static but needs init, 2: dynamic vnode
}

export interface VNodeData {
  sel?: string;
  attributes: Record<string, string>;
  directives: Record<string, string>;
}
