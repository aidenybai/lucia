import compile from '../compile';
import render from '../render';

describe('.render', () => {
  it('should render a directive', () => {
    const el = document.createElement('div');
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    const child3 = document.createElement('div');

    child1.setAttribute('l-custom', 'foo1');
    child2.setAttribute('l-custom', 'foo2');
    child3.setAttribute('l-custom', 'foo3');

    const state = { foo1: 'bar1', foo2: 'bar2' };
    el.setAttribute('l-state', JSON.stringify(state));
    el.appendChild(child1);
    el.appendChild(child2);
    el.appendChild(child3);

    const callback = jest.fn();
    const ast = compile(el, state);

    render(ast, { CUSTOM: callback }, state, Object.keys(state));
    render(ast, { CUSTOM: callback }, state, Object.keys(state));

    expect(callback).toBeCalledTimes(5);
  });
});
