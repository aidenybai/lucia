import { Directives, State, ASTNode } from './models/structs';

import { directives } from './core/directive';
import compile from './core/compile';
import reactive from './core/reactive';
import patch from './core/patch';

export class App {
  public state: State;
  public directives: Directives;
  public ast?: ASTNode[];

  constructor(state: State = {}) {
    this.state = state;
    this.directives = {};
  }

  public mount(el: HTMLElement | string): State {
    // Accepts both selector and element reference
    const rootEl = typeof el === 'string' ? document.querySelector(el) : el;
    // AST generation
    this.ast = compile(rootEl as HTMLElement, this.state);
    this.state = reactive(this.state, this.render.bind(this)).proxy;
    this.directives = { ...this.directives, ...directives };

    this.render(Object.keys(this.state));

    // @ts-ignore
    rootEl.__l = this;

    return this.state;
  }

  // Custom directive registration
  public directive(name: string, callback: Function) {
    this.directives[name.toUpperCase()] = callback;
  }

  public render(keys?: string[]) {
    patch(this.ast!, directives, this.state, keys || Object.keys(this.state));
  }
}

export const createApp = (state: State) => new App(state);

export default createApp;
