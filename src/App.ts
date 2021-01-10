import { Directives, State, DOMNode } from './models/structs';

import { directives } from './dream/directive';
import compile from './dream/compile';
import reactive from './dream/reactive';
import patch from './dream/patch';

export class App {
  state: State;
  directives: Directives;
  ast?: DOMNode[];

  constructor(state: State = {}) {
    this.state = state;
    this.directives = {};
  }

  public mount(el: HTMLElement | string, shallow: boolean = false): State {
    // Accepts both selector and element reference
    const rootEl = (typeof el === 'string' ? document.querySelector(el) : el) as HTMLElement;
    this.ast = this.compile(rootEl);
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

  public patch(this: App, keys?: string[]): void {
    patch(this.ast!, directives, this.state, keys);
  }

  public compile(el: HTMLElement): DOMNode[] {
    return compile(el, this.state);
  }
}

export const createApp = (state: State) => {
  return new App(state);
};

export default createApp;
