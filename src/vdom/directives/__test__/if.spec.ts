import { ifDirective } from '../if';
import compute from '../../utils/compute';

describe('.ifDirective', () => {
  it('should set display to none', () => {
    const el = document.createElement('div');
    const expression = 'this.showme';
    const state = { showme: false };
    ifDirective({
      el,
      name: 'l-if',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.style.display).toBe('none');
  });

  it('should remove display', () => {
    const el = document.createElement('div');
    const expression = 'this.showme';
    const state = { showme: true };
    ifDirective({
      el,
      name: 'l-if',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.style.display).toBe('');
  });
});
