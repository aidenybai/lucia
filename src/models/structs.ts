import { UnknownKV } from './generics';

export type Directives = Record<string, Function>;
export type Components = Record<string, Function>;
export type State = UnknownKV;

export type DirectiveKV = Record<string, DirectiveData>;

export interface DirectiveData {
  compute: Function;
  value: string;
  keys: string[];
}

export interface DirectiveProps {
  el: HTMLElement;
  name: string;
  data: DirectiveData;
  state: State;
}

export interface ASTNode {
  directives: DirectiveKV;
  keys: string[];
  el: HTMLElement;
  type: ASTNodeType;
}

export enum ASTNodeType {
  STATIC = 0,
  DYNAMIC = 1,
}
