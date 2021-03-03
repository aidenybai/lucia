import { htmlDirective } from '../html';
import compute from '../../utils/computeExpression';

describe('.htmlDirective', () => {
  it('should interpolate state into interHTML', () => {
    const el = document.createElement('div');
    const expression = 'foo';
    const state = { foo: 'bar' };
    const data = { value: expression, compute: compute(expression, el), deps: ['foo'] };
    const node = {
      el,
      directives: { html: data },
      deps: [],
      type: 1,
    };
    htmlDirective({
      el,
      parts: ['html'],
      data,
      state,
      node,
    });
    expect(el.innerHTML).toEqual('bar');
  });

  it('should set the html to the value', () => {
    const el = document.createElement('div');
    const expression = '<p>foo</p>';
    const state = {};
    const data = { value: expression, compute: compute(expression, el), deps: [] };
    const node = {
      el,
      directives: { html: data },
      deps: [],
      type: 1,
    };
    htmlDirective({
      el,
      parts: ['html'],
      data,
      state,
      node,
    });
    expect(el.innerHTML).toEqual('<p>foo</p>');
  });

  it('should allow usage of directives and components', () => {
    const el = document.createElement('div');
    const expression = `foo`;
    const state = { foo: '<p l-text="bar"></p>' };
    const data = { value: expression, compute: compute(expression, el), deps: ['foo'] };
    const node = {
      el,
      directives: { html: data },
      deps: [],
      type: 1,
    };
    htmlDirective({
      el,
      parts: ['l-html'],
      data,
      state,
      node,
    });
    expect(el.innerHTML).toEqual('<p l-text="bar">bar</p>');
  });
});
