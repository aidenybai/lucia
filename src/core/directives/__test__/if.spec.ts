import { ifDirective } from '../if';
import compute from '../../utils/computeExpression';

describe('.ifDirective', () => {
  it('should remove el', () => {
    const el = document.createElement('div');
    const expression = 'showme';
    const state = { showme: false };
    const node = {
      el,
      directives: {},
      deps: [],
      type: 1,
    };
    ifDirective({
      el,
      name: 'l-if',
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
      node,
    });
    // @ts-ignore
    expect(node.el.__l_if_template).toEqual(true);
  });
});
