export const DIRECTIVE_PREFIX = 'l-';

export type Directives = Record<string, Function>;
export type Components = Record<string, Function>;
export type View = Record<string, unknown>;
export type UnknownKV = Record<string, unknown>;
export type StringKV = Record<string, string>;

export interface DirectiveProps {
  el: HTMLElement;
  name: string;
  value: string;
  view: View;
}

export interface Data {
  $el?: HTMLElement;
  $view: Record<string, unknown>;
}

export interface VNode {
  tag: string;
  children: VNodeChildren;
  props: VNodeProps;
}

export interface VNodeProps {
  ref?: HTMLElement;
  type: VNodeTypes.STATIC | VNodeTypes.NEEDS_PATCH | VNodeTypes.DYNAMIC;
  attributes: StringKV;
  directives: StringKV;
}

export type VNodeChild = VNode | string;
export type VNodeChildren = (VNode | string)[];

export enum VNodeTypes {
  STATIC = 0,
  NEEDS_PATCH = 1,
  DYNAMIC = 2,
}
