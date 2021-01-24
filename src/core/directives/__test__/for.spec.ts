import { forDirective } from '../for';
import compute from '../../utils/computeExpression';

describe('.forDirective', () => {
  it('should join the state array into HTML', () => {
    const el = document.createElement('ul');
    const expression = `bar in foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    // @ts-ignore
    el.__l_for_template = '<li l-text="this.bar"></li>';
    el.innerHTML = '<li l-text="this.bar"></li>';
    forDirective({
      el,
      name: 'l-for',
      data: { value: expression, compute: compute(expression, el), keys: ['foo'] },
      state,
    });
    expect(el.innerHTML).toEqual(
      '<li l-text="foo[0]">bar</li><li l-text="foo[1]">bar</li><li l-text="foo[2]">bar</li>'
    );
  });

  it('should provide both item and index upon request', () => {
    const el = document.createElement('p');
    const expression = `bar, i in foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    // @ts-ignore
    el.__l_for_template = '<li l-text="this.bar + this.i"></li>';
    el.innerHTML = '<li l-text="this.bar + this.i"></li>';
    forDirective({
      el,
      name: 'l-for',
      data: { value: expression, compute: compute(expression, el), keys: ['foo'] },
      state,
    });
    expect(el.innerHTML).toEqual(
      '<li l-text="foo[0] + 0">bar0</li><li l-text="foo[1] + 1">bar1</li><li l-text="foo[2] + 2">bar2</li>'
    );
  });

  it('should string together __l_for_template if item and index are not present', () => {
    const el = document.createElement('p');
    const expression = `in foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    // @ts-ignore
    el.__l_for_template = '<li></li>';
    forDirective({
      el,
      name: 'l-for',
      data: { value: expression, compute: compute(expression, el), keys: ['foo'] },
      state,
    });
    expect(el.innerHTML).toEqual('<li></li><li></li><li></li>');
  });

  it('should handle basic addition', () => {
    const el = document.createElement('p');
    const expression = `in foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    // @ts-ignore
    el.__l_for_template = '<li></li>';
    // @ts-ignore
    el.__l_for_state = ['bar', 'bar'];
    el.innerHTML = '<li></li><li></li>';
    forDirective({
      el,
      name: 'l-for',
      data: { value: expression, compute: compute(expression, el), keys: ['foo'] },
      state,
    });
    expect(el.innerHTML).toEqual('<li></li><li></li><li></li>');
  });

  it('should handle basic deletion', () => {
    const el = document.createElement('p');
    const expression = `in foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    // @ts-ignore
    el.__l_for_template = '<li></li>';
    // @ts-ignore
    el.__l_for_state = ['bar', 'bar', 'bar', 'bar'];
    el.innerHTML = '<li></li><li></li><li></li><li></li>';
    forDirective({
      el,
      name: 'l-for',
      data: { value: expression, compute: compute(expression, el), keys: ['foo'] },
      state,
    });
    expect(el.innerHTML).toEqual('<li></li><li></li><li></li>');
  });
});
