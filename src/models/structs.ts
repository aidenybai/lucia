import { UnknownKV } from './generics';

export type Directives = Record<string, (props: DirectiveProps) => void>;
export type Watchers = Record<string, () => void>;
export type Refs = Record<string, HTMLElement>;
export type State = UnknownKV;

export type DirectiveKV = Record<string, DirectiveData>;

export interface DirectiveData {
  compute: (state: UnknownKV, event?: Event) => any;
  value: string;
  deps: string[];
}

export interface DirectiveProps {
  el: HTMLElement;
  parts: string[];
  data: DirectiveData;
  state: State;
  node?: ASTNode;
}

export interface ASTNode {
  directives: DirectiveKV;
  deps: string[];
  el: HTMLElement;
  type: ASTNodeType;
}

export enum ASTNodeType {
  NULL = -1,
  STATIC = 0,
  DYNAMIC = 1,
}
