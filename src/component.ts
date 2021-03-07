import { Directives, DirectiveProps, Watchers, State, ASTNode } from './models/structs';

import { directives } from './core/directive';
import compile from './core/compile';
import reactive from './core/reactive';
import render from './core/render';

import { setElementCustomProp } from './core/utils/elementCustomProp';

export class Component {
  public state: State;
  public directives: Directives;
  public watchers: Watchers;
  public ast?: ASTNode[];

  constructor(state: State = {}, directives: Directives = {}, watchers: Watchers = {}) {
    this.state = state;
    this.directives = directives;
    this.watchers = watchers;
  }

  public mount(el: HTMLElement | string): State {
    // Accepts both selector and element reference
    const rootEl = typeof el === 'string' ? document.querySelector(el) : el;
    const $render = (deps: string[] = Object.keys(this.state)) => this.render(deps);

    // AST generation
    this.ast = compile(rootEl as HTMLElement, this.state);
    this.directives = { ...this.directives, ...directives };
    this.state = reactive({ ...this.state, $render }, this.render.bind(this), this.watchers);

    this.render();

    setElementCustomProp(rootEl as HTMLElement, 'component', this);

    return this.state;
  }

  public directive(name: string, callback: (props: DirectiveProps) => void) {
    this.directives[name.toUpperCase()] = callback;
  }

  public watch(name: string, callback: () => void) {
    this.watchers[name] = callback;
  }

  public render(props: string[] = Object.keys(this.state)) {
    render(this.ast!, directives, this.state, props);
  }
}

export const component = (state?: State) => new Component(state);

export default component;
