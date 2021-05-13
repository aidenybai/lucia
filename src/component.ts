/* istanbul ignore file */

import compile from '@core/compile';
import { directives } from '@core/directive';
import reactive from '@core/reactive';
import render from '@core/render';
import { error } from '@core/utils/log';
import { COMPONENT_FLAG } from '@models/generics';
import { ASTNode, Directives, State, Watchers } from '@models/structs';

export class Component {
  public state: State;
  public directives: Directives;
  public watchers: Watchers;
  public ast: ASTNode[];

  constructor(state: State = {}, watchers: Watchers = {}) {
    this.ast = [];
    this.state = state;
    this.directives = directives;
    this.watchers = watchers;
  }

  public mount(el: HTMLElement | string): void {
    // Accepts both selector and element reference
    const rootEl =
      typeof el === 'string'
        ? document.querySelector<HTMLElement>(el) || document.body
        : (el as HTMLElement);
    const newState = { ...this.state, $render: this.render.bind(this) };

    this.ast = compile(rootEl, this.state);
    this.state = reactive(newState, this.render.bind(this), this.watchers);

    this.render();

    rootEl[COMPONENT_FLAG] = this;

    const mountedEvent = new CustomEvent('mounted');
    rootEl.dispatchEvent(mountedEvent);
  }

  public render(props: string[] = Object.keys(this.state)): void {
    render(this.ast, directives, this.state, props);
  }
}

export class ComponentFactory {
  public state: () => State;
  public watchers: Watchers;

  constructor(state: () => State) {
    this.state = state;
    this.watchers = {};
  }

  public init(el: HTMLElement | string): Component {
    const c = new Component(this.state(), this.watchers);
    c.mount(el);
    console.log(c);
    return c;
  }

  public watch(name: string, callback: () => void): void {
    this.watchers[name] = callback;
  }
}

export const component = (state: () => State): ComponentFactory => {
  if (typeof state !== 'function') error('State must be function that returns the state object.');
  return new ComponentFactory(state);
};

export default component;
