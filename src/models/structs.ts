import { KV } from './generics';

export type Directives = KV<(props: DirectiveProps) => void>;
export type Refs = KV<HTMLElement>;
export type State = KV<unknown>;

export type DirectiveKV = KV<DirectiveData>;

export type KeyedEvent = KeyboardEvent | MouseEvent | TouchEvent;

export interface DirectiveData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compute: (state: KV<unknown>, event?: Event) => any;
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
