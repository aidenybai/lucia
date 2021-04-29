import compute from '../../utils/computeExpression';
import { showDirective } from '../show';

describe('.showDirective', () => {
  it('should interpolate state into innerText', () => {
    const el = document.createElement('div');
    const expression = 'foo';
    const state = { foo: true };

    showDirective({
      el,
      parts: [`show`],
      data: {
        value: expression,
        compute: compute(expression, el),
        deps: ['foo'],
      },
      state,
    });
    expect(el.style.display).toEqual('');

    state.foo = false;

    showDirective({
      el,
      parts: [`show`],
      data: {
        value: expression,
        compute: compute(expression, el),
        deps: ['foo'],
      },
      state,
    });
    expect(el.style.display).toEqual('none');
  });
});
