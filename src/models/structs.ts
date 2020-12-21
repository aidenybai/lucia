import { UnknownKV } from './generics';

export type Directives = Record<string, Function>;
export type Components = Record<string, Function>;
export type State = UnknownKV;

export type DirectiveKV = Record<string, DirectiveData>;

export interface DirectiveData {
  compute: Function;
  value: string;
}

export interface DirectiveApp {
  state?: State;
  directives?: Directives;
  components?: Components;
}

export interface DirectiveProps {
  el: HTMLElement;
  name: string;
  data: DirectiveData;
  app: DirectiveApp;
}

export interface Data {
  $el?: HTMLElement;
}
