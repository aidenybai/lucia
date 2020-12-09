import { ifDirective } from '../if';

describe('.ifDirective', () => {
  it('should set it to hidden', () => {
    const fakeElem = document.createElement('div');
    ifDirective({
      el: fakeElem,
      name: 'l-if',
      value: 'this.showme',
      view: { showme: false },
    });
    expect(fakeElem.style.display).toBe('none');
  });
});
