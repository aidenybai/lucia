import { StringKV } from './generics';
import { DirectiveKV } from './structs';

export interface VNode {
  tag: string;
  children: VNodeChildren;
  props: VNodeProps;
}

export interface VNodeProps {
  ref?: HTMLElement;
  type: VNodeTypes.STATIC | VNodeTypes.NEEDS_PATCH | VNodeTypes.DYNAMIC;
  attributes: StringKV;
  directives: DirectiveKV;
}

export type VNodeChild = VNode | string;
export type VNodeChildren = (VNode | string)[];

export enum VNodeTypes {
  STATIC = 0,
  NEEDS_PATCH = 1,
  DYNAMIC = 2,
}
