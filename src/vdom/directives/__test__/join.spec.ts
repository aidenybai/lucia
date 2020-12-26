import { joinDirective } from '../join';
import compute from '../../utils/compute';

describe('.joinDirective', () => {
  it('should join the state array into HTML', () => {
    const el = document.createElement('ul');
    const expression = `this.foo`;
    const state = { foo: ['<li>bar</li>', '<li>bar</li>', '<li>bar</li>'] };
    joinDirective({
      el,
      name: 'l-join',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerHTML).toBe('<li>bar</li><li>bar</li><li>bar</li>');
  });

  it('should join as text', () => {
    const el = document.createElement('p');
    const expression = `this.foo as text`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    joinDirective({
      el,
      name: 'l-join',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerText).toBe('barbarbar');
  });
  
  it('should allow creation of directives and components', () => {
    const el = document.createElement('p');
    const expression = `this.foo as text`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    joinDirective({
      el,
      name: 'l-join',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: {
        state,
        components: {
          FOO() {},
        },
        directives: {
          FOO() {},
        },
      },
    });
    expect(el.innerText).toBe('barbarbar');
  });
});
