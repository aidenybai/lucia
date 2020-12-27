import { LUCIA_FIRST_RENDER } from './models/generics';
import { Directives, Components, State } from './models/structs';
import { VNode } from './models/vnode';

import { directives } from './vdom/directive';
import compile from './vdom/compile';
import reactive from './vdom/reactive';
import patch from './vdom/patch';

export class App {
  state: State;
  directives: Directives;
  components: Components;
  vdom?: VNode;
  mountHook?: Function;

  constructor(state: State = {}, mountHook?: Function) {
    this.state = state;
    this.directives = {};
    this.components = {};
    this.mountHook = mountHook;
  }

  public mount(el: HTMLElement | string, shallow: boolean = false): State {
    // Accepts both selector and element reference
    const rootEl = typeof el === 'string' ? document.querySelector(el) : el;
    this.vdom = this.compile(rootEl as HTMLElement);
    // Do not generate directives or reactive state if shallow
    if (!shallow) {
      this.state = reactive(this.state, this.patch.bind(this));
      this.directives = { ...this.directives, ...directives };
    }

    // Render everything
    this.patch([LUCIA_FIRST_RENDER]);
    
    if (this.mountHook) this.mountHook(this.state);
    return this.state;
  }

  public component(name: string, templateCallback: Function): void {
    this.components[name.toUpperCase()] = templateCallback;
  }

  public directive(name: string, evaluationCallback: Function): void {
    this.directives[name.toUpperCase()] = evaluationCallback;
  }

  public patch(this: App, keys?: string[]): void {
    const app = {
      state: this.state,
      directives: this.directives,
      components: this.components,
    };
    patch(this.vdom as VNode, app, keys);
  }

  public compile(el: HTMLElement): VNode {
    return compile(el, this.state, this.components, true) as VNode;
  }
}

export const createApp = (state: State, mountHook?: Function) => {
  return new App(state, mountHook);
};

export default createApp;
