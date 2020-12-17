import { joinDirective } from '../join';
import compute from '../../utils/compute';

describe('.joinDirective', () => {
  it('should join the state array into HTML', () => {
    const fakeElem = document.createElement('ul');
    const expression = `this.li`;
    const state = { li: ['<li>test</li>', '<li>test</li>', '<li>test</li>'] };
    joinDirective({
      el: fakeElem,
      name: 'l-join',
      data: { value: expression, run: compute(expression, { $el: fakeElem }) },
      state,
    });
    expect(fakeElem.innerHTML).toBe('<li>test</li><li>test</li><li>test</li>');
  });

  it('should join as text', () => {
    const fakeElem = document.createElement('p');
    const expression = `this.li as text`;
    const state = { li: ['1', '2', '3'] };
    joinDirective({
      el: fakeElem,
      name: 'l-join',
      data: { value: expression, run: compute(expression, { $el: fakeElem }) },
      state,
    });
    expect(fakeElem.innerText).toBe('123');
  });
});
