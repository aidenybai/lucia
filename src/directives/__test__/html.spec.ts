import { htmlDirective } from '../html';

describe('.htmlDirective', () => {
  it('should set the html', () => {
    const fakeElem = document.createElement('div');
    htmlDirective(fakeElem, 'l-html', 'count', { count: 0 });
    expect(fakeElem.innerHTML).toBe('0');
  });
});
