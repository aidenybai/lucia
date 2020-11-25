import { htmlDirective } from '../html';

describe('.htmlDirective', () => {
  it('should set the html', () => {
    const fakeElem = document.createElement('div');
    htmlDirective({
      el: fakeElem,
      name: 'l-html',
      value: 'this.count',
      view: { count: 0 },
    });
    expect(fakeElem.innerHTML).toBe('0');
  });
});
