import { textDirective } from '../text';
import compute from '../../utils/compute';

describe('.textDirective', () => {
  it('should set the text content', () => {
    const fakeElem = document.createElement('div');
    const expression = `'$' + this.money`;
    const state = { money: 0 };
    textDirective({
      el: fakeElem,
      name: `l-text`,
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      state,
    });
    expect(fakeElem.textContent).toBe('$0');
  });
  it('should set the text content to the value', () => {
    const fakeElem = document.createElement('div');
    const expression = `'count'`;
    const state = {};
    textDirective({
      el: fakeElem,
      name: `l-text`,
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      state,
    });
    expect(fakeElem.textContent).toBe('count');
  });
});
