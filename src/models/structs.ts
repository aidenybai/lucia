import { UnknownKV } from './generics';

export type Directives = Record<string, Function>;
export type Components = Record<string, Function>;
export type State = UnknownKV;

export interface DirectiveProps {
  el: HTMLElement;
  name: string;
  value: string;
  state: State;
}

export interface Data {
  $el?: HTMLElement;
  $state: UnknownKV;
}
