import { ifDirective } from '../if';

describe('.ifDirective', () => {
  it('should set it to hidden', () => {
    const fakeElem = document.createElement('div');
    ifDirective({
      el: fakeElem,
      name: 'l-if',
      value: 'showme',
      view: { showme: false },
    });
    expect(fakeElem.hidden).toBe(true);
  });
});
