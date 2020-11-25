import { htmlDirective } from '../html';

describe('.htmlDirective', () => {
  it('should set the html', () => {
    const fakeElem = document.createElement('div');
    htmlDirective({
      el: fakeElem,
      name: 'l-html',
      value: 'count',
      view: { count: 0 },
    });
    expect(fakeElem.innerHTML).toBe('0');
  });
  it('should set the html to the value', () => {
    const fakeElem = document.createElement('div');
    htmlDirective({
      el: fakeElem,
      name: 'l-html',
      value: 'count',
      view: {},
    });
    expect(fakeElem.innerHTML).toBe('count');
  });
});
