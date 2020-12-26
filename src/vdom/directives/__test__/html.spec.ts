import { htmlDirective } from '../html';
import compute from '../../utils/compute';

describe('.htmlDirective', () => {
  it('should set the html', () => {
    const el = document.createElement('div');
    const expression = 'this.count';
    const state = { count: 0 };
    htmlDirective({
      el: el,
      name: 'l-html',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerHTML).toBe('0');
  });
  it('should set the html to the value', () => {
    const el = document.createElement('div');
    const expression = `'count'`;
    const state = {};
    htmlDirective({
      el: el,
      name: 'l-html',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerHTML).toBe('count');
  });
});
