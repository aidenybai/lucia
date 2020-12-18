import { ifDirective } from '../if';
import compute from '../../utils/compute';

describe('.ifDirective', () => {
  it('should set display to none', () => {
    const fakeElem = document.createElement('div');
    const expression = 'this.showme';
    const state = { showme: false };
    ifDirective({
      el: fakeElem,
      name: 'l-if',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      state,
    });
    expect(fakeElem.style.display).toBe('none');
  });
  it('should remove display', () => {
    const fakeElem = document.createElement('div');
    const expression = 'this.showme';
    const state = { showme: true };
    ifDirective({
      el: fakeElem,
      name: 'l-if',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      state,
    });
    expect(fakeElem.style.display).toBe('');
  });
});
