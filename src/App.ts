import { Directives, State, ASTNode } from './models/structs';

import { directives } from './core/directive';
import compile from './core/compile';
import reactive from './core/reactive';
import patch from './core/patch';

export class App {
  state: State;
  directives: Directives;
  ast?: ASTNode[];

  constructor(state: State = {}) {
    this.state = state;
    this.directives = {};
  }

  public mount(el: HTMLElement | string, shallow: boolean = false): State {
    // Accepts both selector and element reference
    const rootEl = typeof el === 'string' ? document.querySelector(el) : el;
    this.ast = this.compile(rootEl as HTMLElement);

    // Do not generate directives or reactive state if shallow
    if (!shallow) {
      this.state = reactive(this.state, this.patch.bind(this));
      this.directives = { ...this.directives, ...directives };
    }

    // Render everything
    this.patch(Object.keys(this.state));

    // @ts-ignore
    rootEl.__l = this;

    return this.state;
  }

  // Custom directive registration
  public directive(name: string, callback: Function) {
    this.directives[name.toUpperCase()] = callback;
  }

  public patch(this: App, keys?: string[]): void {
    patch(this.ast!, directives, this.state, keys);
  }

  public compile(el: HTMLElement): ASTNode[] {
    return compile(el, this.state);
  }
}

export const createApp = (state: State) => new App(state);

export default createApp;
