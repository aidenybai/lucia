import { ifDirective } from '../if';
import compute from '../../utils/computeExpression';

describe('.ifDirective', () => {
  it('should set display to none', () => {
    const el = document.createElement('div');
    const expression = 'showme';
    const state = { showme: false };
    ifDirective({
      el,
      name: 'l-if',
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.style.display).toEqual('none');
  });

  it('should remove display', () => {
    const el = document.createElement('div');
    const expression = 'showme';
    const state = { showme: true };
    ifDirective({
      el,
      name: 'l-if',
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.style.display).toEqual('');
  });

  it('should change visibility rather than display', () => {
    const el = document.createElement('div');
    const expression = 'showme';
    const state = { showme: false };
    ifDirective({
      el,
      name: 'l-if:hidden',
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.hidden).toEqual(true);
  });
});