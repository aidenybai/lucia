import compute from '../../utils/computeExpression';
import { textDirective } from '../text';

describe('.textDirective', () => {
  it('should interpolate state into innerText', () => {
    const el = document.createElement('div');
    const expression = 'foo';
    const state = { foo: 'bar' };

    textDirective({
      el,
      parts: [`text`],
      data: {
        value: expression,
        compute: compute(expression, el),
        deps: ['foo'],
      },
      state,
    });
    expect(el.textContent).toEqual('bar');
  });

  it(`should attempt to coerce to string if prop doesn't exist`, () => {
    const el = document.createElement('div');
    const expression = `foo`;
    const state = {};
    textDirective({
      el,
      parts: [`text`],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.textContent).toEqual('foo');
  });
});
