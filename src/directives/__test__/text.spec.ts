import { textDirective } from '../text';

describe('.textDirective', () => {
  it('should set the text content', () => {
    const fakeElem = document.createElement('div');
    textDirective({
      el: fakeElem,
      name: `l-text`,
      value: `'$' + this.money`,
      view: { money: 0 },
    });
    expect(fakeElem.textContent).toBe('$0');
  });
});
