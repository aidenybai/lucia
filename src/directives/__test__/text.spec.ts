import { textDirective } from '../text';

describe('.textDirective', () => {
  it('should set the text content', () => {
    const fakeElem = document.createElement('div');
    textDirective(fakeElem, 'l-text', "'$' + money", { money: 0 });
    expect(fakeElem.textContent).toBe('$0');
  });
});
