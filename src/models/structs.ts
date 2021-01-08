import { UnknownKV } from './generics';

export type Directives = Record<string, Function>;
export type Components = Record<string, Function>;
export type State = UnknownKV;
export type FunctionGroup = Record<string, string[]>;

export type DirectiveKV = Record<string, DirectiveData>;

export interface DirectiveData {
  compute: Function;
  value: string;
  keys: (FunctionGroup | string)[];
}

export interface DirectiveProps {
  el: HTMLElement;
  name: string;
  data: DirectiveData;
  state: State;
}

export interface MagicProps {
  $el?: HTMLElement;
}

export interface DOMNode {
  directives: DirectiveKV;
  el: HTMLElement;
  isDynamic?: boolean;
}