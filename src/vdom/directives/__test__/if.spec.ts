import { ifDirective } from '../if';

describe('.ifDirective', () => {
  it('should set display to none', () => {
    const fakeElem = document.createElement('div');
    ifDirective({
      el: fakeElem,
      name: 'l-if',
      value: 'this.showme',
      state: { showme: false },
    });
    expect(fakeElem.style.display).toBe('none');
  });
  it('should remove display', () => {
    const fakeElem = document.createElement('div');
    ifDirective({
      el: fakeElem,
      name: 'l-if',
      value: 'this.showme',
      state: { showme: true },
    });
    expect(fakeElem.style.display).toBe('');
  });
});
