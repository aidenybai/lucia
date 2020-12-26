import { joinDirective } from '../join';
import compute from '../../utils/compute';

describe('.joinDirective', () => {
  it('should join the state array into HTML', () => {
    const el = document.createElement('ul');
    const expression = `this.li`;
    const state = { li: ['<li>test</li>', '<li>test</li>', '<li>test</li>'] };
    joinDirective({
      el: el,
      name: 'l-join',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerHTML).toBe('<li>test</li><li>test</li><li>test</li>');
  });

  it('should join as text', () => {
    const el = document.createElement('p');
    const expression = `this.li as text`;
    const state = { li: ['1', '2', '3'] };
    joinDirective({
      el: el,
      name: 'l-join',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerText).toBe('123');
  });
});
