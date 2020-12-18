import { htmlDirective } from '../html';
import compute from '../../utils/compute';

describe('.htmlDirective', () => {
  it('should set the html', () => {
    const fakeElem = document.createElement('div');
    const expression = 'this.count';
    const state = { count: 0 };
    htmlDirective({
      el: fakeElem,
      name: 'l-html',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      state,
    });
    expect(fakeElem.innerHTML).toBe('0');
  });
  it('should set the html to the value', () => {
    const fakeElem = document.createElement('div');
    const expression = `'count'`;
    const state = {};
    htmlDirective({
      el: fakeElem,
      name: 'l-html',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      state,
    });
    expect(fakeElem.innerHTML).toBe('count');
  });
});
