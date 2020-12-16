import { LUCIA_COMPILE_REQUEST } from './models/generics';
import { Directives, Components, State } from './models/structs';
import { VNode } from './models/vnode';

import compile from './vdom/compile';
import { directives } from './vdom/directive';
import reactive from './vdom/reactive';
import patch from './vdom/patch';

export class App {
  vdom: VNode | null;
  state: State;
  directives: Directives;
  components: Components;
  mountHook: Function | undefined;

  constructor(state: State = {}, mountHook?: Function) {
    this.vdom = null;
    this.state = state;
    this.directives = {};
    this.components = {};
    this.mountHook = mountHook;
  }

  public mount(el: HTMLElement | string, shallow: boolean = false): State {
    this.vdom = this.compile(
      (typeof el === 'string' ? document.querySelector(el) : el) as HTMLElement
    );
    if (!shallow) {
      this.state = reactive(this.state, this.patch.bind(this));
      this.directives = directives;
    }

    this.patch([LUCIA_COMPILE_REQUEST]);
    if (this.mountHook) this.mountHook(this.state);
    return this.state;
  }

  public component(name: string, fn: Function) {
    this.components[name.toUpperCase()] = fn;
  }

  public directive(name: string, fn: Function) {
    this.directives[name.toUpperCase()] = fn;
  }

  // Use internal private methods, should not be used when instantiated by the user
  private patch(this: App, keys?: string[]): void {
    patch(this.vdom as VNode, this.state, this.directives, keys);
  }

  private compile(el: HTMLElement): VNode {
    return compile(el, this.state, this.components, true) as VNode;
  }
}

export const createApp = (state: State, mountHook?: Function) => {
  return new App(state, mountHook);
};

export default createApp;
