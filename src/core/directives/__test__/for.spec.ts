// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { COMPONENT_FLAG, FOR_TEMPLATE_FLAG } from '../../../models/generics';
import compute from '../../utils/computeExpression';
import { forDirective } from '../for';

const FOR_STATE_FLAG = '__for_state';

describe('.forDirective', () => {
  it('should join the state array into HTML', (done) => {
    const el = document.createElement('ul');
    const expression = `bar in foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    const data = {
      value: expression,
      compute: compute(expression, el),
      deps: ['foo'],
    };

    el[FOR_TEMPLATE_FLAG] = '<li l-text="this.bar"></li>';
    el.innerHTML = '<li l-text="this.bar"></li>';

    forDirective({
      el,
      name: 'l-for',
      data,
      state,
      node: { el, directives: { for: data } },
    });

    setTimeout(() => {
      expect(el.innerHTML).toEqual(
        '<li l-text="foo[0]">bar</li><li l-text="foo[1]">bar</li><li l-text="foo[2]">bar</li>',
      );
      done();
    }, 0);
  });

  it('should provide both item and index upon request', () => {
    const el = document.createElement('table');
    const expression = `(bar, i) in foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    const data = {
      value: expression,
      compute: compute(expression, el),
      deps: ['foo'],
    };

    el[FOR_TEMPLATE_FLAG] = '<tbody l-text="this.bar + this.i"></tbody>';

    el.innerHTML = '<tbody l-text="this.bar + this.i"></tbody>';
    forDirective({
      el,
      name: 'l-for',
      data,
      state,
      node: { el, directives: { for: data } },
    });
    expect(el.innerHTML).toEqual(
      '<tbody l-text="foo[0] + 0">bar0</tbody><tbody l-text="foo[1] + 1">bar1</tbody><tbody l-text="foo[2] + 2">bar2</tbody>',
    );
  });

  it('should string together FOR_TEMPLATE_FLAG if item and index are not present', () => {
    const el = document.createElement('p');
    const expression = `_ in foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    const data = {
      value: expression,
      compute: compute(expression, el),
      deps: ['foo'],
    };

    el[FOR_TEMPLATE_FLAG] = '<li></li>';

    forDirective({
      el,
      name: 'l-for',
      data,
      state,
      node: { el, directives: { for: data } },
    });
    expect(el.innerHTML).toEqual('<li></li><li></li><li></li>');
  });

  it('should handle basic addition', () => {
    const el = document.createElement('p');
    const expression = `_ in foo`;
    const state = { foo: ['bar', 'bar'] };
    const data = {
      value: expression,
      compute: compute(expression, el),
      deps: ['foo'],
    };

    el[FOR_TEMPLATE_FLAG] = '<li></li>';
    el[FOR_STATE_FLAG] = ['bar', 'bar'];

    el.innerHTML = '<li></li>';
    forDirective({
      el,
      name: 'l-for',
      data,
      state,
      node: { el, directives: { for: data } },
    });
    expect(el.innerHTML).toEqual('<li></li><li></li>');
  });

  it('should handle basic deletion', () => {
    const el = document.createElement('p');
    const expression = `_ in foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    const data = {
      value: expression,
      compute: compute(expression, el),
      deps: ['foo'],
    };

    el[FOR_TEMPLATE_FLAG] = '<li></li>';
    el[FOR_STATE_FLAG] = ['bar', 'bar', 'bar'];

    el.innerHTML = '<li></li><li></li><li></li><li></li>';
    forDirective({
      el,
      name: 'l-for',
      data,
      state,
      node: { el, directives: { for: data } },
    });
    expect(el.innerHTML).toEqual('<li></li><li></li><li></li>');
  });

  it('should use default AST if available', () => {
    const el = document.createElement('p');
    const expression = `_ in foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    const data = {
      value: expression,
      compute: compute(expression, el),
      deps: ['foo'],
    };

    el[FOR_TEMPLATE_FLAG] = '<li></li>';
    el[FOR_STATE_FLAG] = ['bar', 'bar', 'bar'];
    el[COMPONENT_FLAG] = [];

    el.innerHTML = '<li></li><li></li><li></li><li></li>';
    forDirective({
      el,
      name: 'l-for',
      data,
      state,
      node: { el, directives: { for: data } },
    });
    expect(el.innerHTML).toEqual('<li></li><li></li><li></li>');
  });

  it('should handle user provided array if available', () => {
    const el = document.createElement('p');
    const expression = `_ in ['bar', 'bar', 'bar']`;
    const state = {};
    const data = {
      value: expression,
      compute: compute(expression, el),
      deps: [],
    };

    el[FOR_TEMPLATE_FLAG] = '<li></li>';
    el[FOR_STATE_FLAG] = ['bar', 'bar', 'bar'];
    el[COMPONENT_FLAG] = [];

    el.innerHTML = '<li></li><li></li><li></li><li></li>';
    forDirective({
      el,
      name: 'l-for',
      data,
      state,
      node: { el, directives: { for: data } },
    });
    expect(el.innerHTML).toEqual('<li></li><li></li><li></li>');
  });

  it('should rerender if arrayDiff is not 0', () => {
    const el = document.createElement('p');
    const expression = `_ in foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    const data = {
      value: expression,
      compute: compute(expression, el),
      deps: ['foo'],
    };

    el[FOR_TEMPLATE_FLAG] = '<li></li>';
    el[FOR_STATE_FLAG] = ['bar', 'bar', 'bar'];
    el[COMPONENT_FLAG] = [];

    el.innerHTML = '<li></li><li></li><li></li><li></li>';
    forDirective({
      el,
      name: 'l-for',
      data,
      state,
      node: { el, directives: { for: data } },
    });
    forDirective({
      el,
      name: 'l-for',
      data,
      state,
      node: { el, directives: { for: data } },
    });
    expect(el.innerHTML).toEqual('<li></li><li></li><li></li>');
  });

  it('should clear innerHTML if currArray is 0', () => {
    const el = document.createElement('p');
    const expression = `_ in foo`;
    const state = { foo: [] };
    const data = {
      value: expression,
      compute: compute(expression, el),
      deps: ['foo'],
    };

    el[FOR_TEMPLATE_FLAG] = '<li></li>';
    el[FOR_STATE_FLAG] = [];
    el[COMPONENT_FLAG] = [];

    el.innerHTML = '<li></li>';
    forDirective({
      el,
      name: 'l-for',
      data,
      state,
      node: { el, directives: { for: data } },
    });
    forDirective({
      el,
      name: 'l-for',
      data,
      state,
      node: { el, directives: { for: data } },
    });
    expect(el.innerHTML).toEqual('');
  });
});
