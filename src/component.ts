import compile from '@core/compile';
import { directives } from '@core/directive';
import reactive from '@core/reactive';
import render from '@core/render';
import { COMPONENT_FLAG } from '@models/generics';
import { ASTNode, State } from '@models/structs';

/**
 * Holds state and AST, runs directives and renders content
 * Do not instantiate this directly, rather use the `component`
 * function to generate a Component.
 * @property {State} state - The data that pertains to the Component
 * @property {ASTNode[]} ast - The Abstract Syntax Tree that models the HTML
 */
export class Component {
  state: State = Object.seal({});
  ast: ASTNode[] = [];

  constructor(state: State) {
    this.ast = [];
    this.state = state;
  }

  /**
   * Initialize the component
   * @param {HTMLElement|string} el - Component element root
   * @returns {undefined}
   */
  mount(el: HTMLElement | string): void {
    // Accepts both selector and element reference
    const rootEl =
      el instanceof HTMLElement ? el : document.querySelector<HTMLElement>(el) || document.body;
    const finalState = { ...this.state, $render: this.render.bind(this) };

    this.ast = compile(rootEl, this.state);
    this.state = reactive(finalState, this.render.bind(this));

    this.render();

    rootEl[COMPONENT_FLAG] = this;
  }

  /**
   * Force renders the DOM based on props
   * @param {string[]=} props - Array of root level properties in state
   * @returns {undefined}
   */
  render(props: string[] = Object.keys(this.state)): void {
    render(this.ast, directives, this.state, props);
  }
}

/**
 * Instantiates and returns a Component class. NOTE: components may
 * only be mounted once on one element.
 * @param {State} state - The data that pertains to the Component
 * @returns {Component}
 */
export const component = (state: State): Component => new Component(state);

export default component;
