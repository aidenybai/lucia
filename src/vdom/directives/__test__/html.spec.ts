import { htmlDirective } from '../html';

describe('.htmlDirective', () => {
  it('should set the html', () => {
    const fakeElem = document.createElement('div');
    htmlDirective({
      el: fakeElem,
      name: 'l-html',
      value: 'this.count',
      state: { count: 0 },
    });
    expect(fakeElem.innerHTML).toBe('0');
  });
  it('should set the html to the value', () => {
    const fakeElem = document.createElement('div');
    htmlDirective({
      el: fakeElem,
      name: 'l-html',
      value: `'count'`,
      state: {},
    });
    expect(fakeElem.innerHTML).toBe('count');
  });
});
