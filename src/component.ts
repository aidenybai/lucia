/* istanbul ignore file */

import compile from '@core/compile';
import { directives } from '@core/directive';
import reactive from '@core/reactive';
import render from '@core/render';
import { COMPONENT_FLAG } from '@models/generics';
import { ASTNode, Directives, State } from '@models/structs';

export class Component {
  public state: State;
  public directives: Directives;
  public ast: ASTNode[];

  constructor(state: State = {}) {
    this.ast = [];
    this.state = state;
    this.directives = directives;
  }

  public mount(el: HTMLElement | string): void {
    // Accepts both selector and element reference
    const rootEl =
      typeof el === 'string'
        ? document.querySelector<HTMLElement>(el) || document.body
        : (el as HTMLElement);
    const finalState = { ...this.state, $render: this.render.bind(this) };

    this.ast = compile(rootEl, this.state);
    this.state = reactive(finalState, this.render.bind(this));

    this.render();

    rootEl[COMPONENT_FLAG] = this;
  }

  public render(props: string[] = Object.keys(this.state)): void {
    render(this.ast, directives, this.state, props);
  }
}

export const component = (state: State): Component => new Component(state);

export default component;
