import { ifDirective } from '../if';
import compute from '../../utils/computeExpression';
import { getCustomProp } from '../../utils/customProp';

describe('.ifDirective', () => {
  it('should conditionally remove element', () => {
    const el = document.createElement('div');
    const expression = 'visible';
    const state = { visible: false };
    const data = { value: expression, compute: compute(expression, el), deps: [] };
    const node = {
      el,
      directives: { if: data },
      deps: [],
      type: 1,
    };
    ifDirective({
      el,
      name: 'l-if',
      data,
      state,
      node,
    });

    expect(getCustomProp(node.el, '__l_if_template')).toEqual(true);
    expect(node.el.tagName).toEqual('TEMPLATE');
    expect(node.el.nextElementSibling).toBeFalsy();
  });

  it('should conditionally append element', () => {
    const root = document.createElement('div');
    const el = document.createElement('div');
    const expression = 'visible';
    const state = { visible: true };
    const data = { value: expression, compute: compute(expression, el), deps: [] };
    root.appendChild(el);

    const node = {
      el,
      directives: { if: data },
      deps: [],
      type: 1,
    };
    ifDirective({
      el,
      name: 'l-if',
      data,
      state,
      node,
    });

    expect(getCustomProp(node.el, '__l_if_template')).toEqual(true);
    expect(node.el.tagName).toEqual('TEMPLATE');
    expect(node.el.nextElementSibling).toBeDefined();
  });

  it('should conditionally append element', () => {
    const root = document.createElement('div');
    const el = document.createElement('div');
    const expression = 'visible';
    const state = { visible: true };
    const data = { value: expression, compute: compute(expression, el), deps: [] };
    root.appendChild(el);

    const node = {
      el,
      directives: { if: data },
      deps: [],
      type: 1,
    };
    ifDirective({
      el,
      name: 'l-if',
      data,
      state,
      node,
    });

    expect(getCustomProp(node.el, '__l_if_template')).toEqual(true);
    expect(node.el.tagName).toEqual('TEMPLATE');
    expect(node.el.nextElementSibling).toBeDefined();
  });
});
