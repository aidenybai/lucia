import { UnknownKV } from './generics';

export type Directives = Record<string, Function>;
export type Components = Record<string, Function>;
export type View = UnknownKV;

export interface DirectiveProps {
  el: HTMLElement;
  name: string;
  value: string;
  view: View;
}

export interface Data {
  $el?: HTMLElement;
  $view: UnknownKV;
}
