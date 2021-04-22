/* istanbul ignore file */

import { COMPONENT_FLAG } from './models/generics';
import compile from './core/compile';
import { directives } from './core/directive';
import reactive from './core/reactive';
import render from './core/render';
import { setElementCustomProp } from './core/utils/elementCustomProp';
import { ASTNode, DirectiveProps, Directives, State, Watchers } from './models/structs';

export class Component {
  public state: State;
  public directives: Directives;
  public watchers: Watchers;
  public ast: ASTNode[];

  constructor(state: State = {}, directives: Directives = {}, watchers: Watchers = {}) {
    this.ast = [];
    this.state = state;
    this.directives = directives;
    this.watchers = watchers;
  }

  public mount(el: HTMLElement | string): State {
    // Accepts both selector and element reference
    const rootEl =
      typeof el === 'string'
        ? document.querySelector<HTMLElement>(el) || document.body
        : (el as HTMLElement);
    const newState = { ...this.state, $render: this.render.bind(this) };

    this.ast = compile(rootEl, this.state);
    this.directives = { ...this.directives, ...directives };
    this.state = reactive(newState, this.render.bind(this), this.watchers);

    this.render();

    setElementCustomProp(rootEl, COMPONENT_FLAG, this);

    return this.state;
  }

  public directive(name: string, callback: (props: DirectiveProps) => void): void {
    this.directives[name.toUpperCase()] = callback;
  }

  public watch(name: string, callback: () => void): void {
    this.watchers[name] = callback;
  }

  public render(props: string[] = Object.keys(this.state)): void {
    render(this.ast, directives, this.state, props);
  }
}

export const component = (state?: State): Component => new Component(state);

export default component;
