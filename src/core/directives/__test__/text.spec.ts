import { textDirective } from '../text';
import compute from '../../utils/computeExpression';

describe('.textDirective', () => {
  it('should set the text content', () => {
    const el = document.createElement('div');
    const expression = `'$' + money`;
    const state = { money: 0 };
    textDirective({
      el,
      name: `l-text`,
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.textContent).toEqual('$0');
  });

  it('should set the text content to the value', () => {
    const el = document.createElement('div');
    const expression = `'count'`;
    const state = {};
    textDirective({
      el,
      name: `l-text`,
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.textContent).toEqual('count');
  });
});