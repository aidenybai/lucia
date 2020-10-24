import { ifDirective } from '../if';

describe('.ifDirective', () => {
  it('should set it to hidden', () => {
    const fakeElem = document.createElement('div');
    ifDirective(fakeElem, 'l-if', 'showme', { showme: false });
    expect(fakeElem.hidden).toBe(true);
  });
});
