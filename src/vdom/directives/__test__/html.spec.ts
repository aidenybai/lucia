import { htmlDirective } from '../html';
import compute from '../../utils/compute';

describe('.htmlDirective', () => {
  it('should set the html', () => {
    const el = document.createElement('div');
    const expression = 'this.foo';
    const state = { foo: 'bar' };
    htmlDirective({
      el,
      name: 'l-html',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerHTML).toEqual('bar');
  });

  it('should set the html to the value', () => {
    const el = document.createElement('div');
    const expression = `foo`;
    const state = {};
    htmlDirective({
      el,
      name: 'l-html',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerHTML).toEqual('foo');
  });

  it('should create a nested component scope', () => {
    const el = document.createElement('div');
    const expression = `this.foo`;
    const state = { foo: '<p l-text="foo"></p>' };
    htmlDirective({
      el,
      name: 'l-html',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerHTML).toBe('<p l-text="foo">foo</p>');
  });

  it('should allow creation of directives and components', () => {
    const el = document.createElement('div');
    const expression = `this.foo`;
    const state = { foo: '<p l-text="foo"></p>' };
    htmlDirective({
      el,
      name: 'l-html',
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
    expect(el.innerHTML).toBe('<p l-text="foo">foo</p>');
  });
});
