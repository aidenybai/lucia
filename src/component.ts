import { Directives, DirectiveProps, Watchers, State, ASTNode } from './models/structs';

import { directives } from './core/directive';
import compile from './core/compile';
import reactive from './core/reactive';
import render from './core/render';

import { setElementCustomProp } from './core/utils/elementCustomProp';
import { DIRECTIVE_PREFIX } from './models/generics';

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
    const rootEl =
      typeof el === 'string' ? document.querySelector<HTMLElement>(el)! : (el as HTMLElement);
    const $render = (deps: string[] = Object.keys(this.state)) => this.render(deps);

    this.ast = compile(rootEl, this.state);
    this.directives = { ...this.directives, ...directives };
    this.state = reactive({ ...this.state, $render }, this.render.bind(this), this.watchers);

    this.render();

    setElementCustomProp(rootEl, 'component', this);
    this.handleMutations(rootEl);

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

  public handleMutations(el: HTMLElement) {
    const mutationObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        const attrName = String(mutation.attributeName);
        if (
          mutation.type === 'attributes' &&
          attrName.startsWith(DIRECTIVE_PREFIX) &&
          attrName !== `${DIRECTIVE_PREFIX}for`
        ) {
          this.ast = compile(el, this.state);
          this.render();
          console.log('render');
        }
      }
    });

    mutationObserver.observe(el, { attributes: true, subtree: true });
  }
}

export const component = (state?: State) => new Component(state);

export default component;
