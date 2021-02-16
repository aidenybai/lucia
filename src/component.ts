import { Directives, State, ASTNode } from './models/structs';

import { directives } from './core/directive';
import compile from './core/compile';
import reactive from './core/reactive';
import render from './core/render';

import { setElementCustomProp } from './core/utils/elementCustomProp';

export class Component {
  public state: State;
  public directives: Directives;
  public ast?: ASTNode[];

  constructor(state: State = {}) {
    this.state = state;
    this.directives = {};
  }

  public mount(el: HTMLElement | string, proxify: boolean = true): State {
    // Accepts both selector and element reference
    const rootEl = typeof el === 'string' ? document.querySelector(el) : el;
    const $render = (deps: string[] = Object.keys(this.state)) => this.render(deps);

    // AST generation
    this.ast = compile(rootEl as HTMLElement, this.state);
    this.state = { ...this.state, $render };

    this.state = proxify ? reactive(this.state, this.render.bind(this)).proxy : this.state;
    this.directives = { ...this.directives, ...directives };

    this.render();

    setElementCustomProp(rootEl as HTMLElement, '__l', this);

    return this.state;
  }

  // Custom directive registration
  public directive(name: string, callback: Function) {
    this.directives[name.toUpperCase()] = callback;
  }

  public render(props: string[] = Object.keys(this.state)) {
    render(this.ast!, directives, this.state, props);
  }
}

export const component = (state: State | undefined) => new Component(state);

export default component;
