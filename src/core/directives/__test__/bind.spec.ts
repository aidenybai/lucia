import { bindDirective } from '../bind';
import compute from '../../utils/computeExpression';

describe('.bindDirective', () => {
  it('should bind class based on state boolean value', () => {
    const el = document.createElement('p');
    const expression = '{ test: test }';
    const state = { test: true };
    bindDirective({
      el,
      parts: ['bind', 'class'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.className).toEqual('test');
  });

  it('should retain original className prop', () => {
    const el = document.createElement('p');
    const expression = '{ test: test }';
    const state = { test: false };
    el.className = 'test2';
    bindDirective({
      el,
      parts: ['bind', 'class'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.className).toEqual('test2');
  });

  it('should not have className prop', () => {
    const el = document.createElement('p');
    const expression = '{ test: test }';
    const state = { test: false };
    bindDirective({
      el,
      parts: ['bind', 'class'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.className).toEqual('');
  });

  it('should accept string for class', () => {
    const el = document.createElement('p');
    const expression = 'test';
    const state = { test: 'foo' };
    bindDirective({
      el,
      parts: ['bind', 'class'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.className).toEqual('foo');
  });

  it('should accept array for class', () => {
    const el = document.createElement('p');
    const expression = 'test';
    const state = { test: ['foo', 'bar', 'baz'] };
    bindDirective({
      el,
      parts: ['bind', 'class'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.className).toEqual('foo bar baz');
  });

  it('should bind style based on state value', () => {
    const el = document.createElement('p');
    const expression = '{ fontWeight: test }';
    const state = { test: 'bold' };
    bindDirective({
      el,
      parts: ['bind', 'style'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.style.cssText).toEqual('font-weight: bold;');
  });

  it('should bind href to anchor tag based on state value', () => {
    const el = document.createElement('a');
    const expression = 'url';
    const state = { url: 'https://example.com/' };
    bindDirective({
      el,
      parts: ['bind', 'href'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.href).toEqual('https://example.com/');
  });

  it('should allow boolean input for attributes', () => {
    const el = document.createElement('a');
    const expression = 'hideme';
    let state = { hideme: true };
    bindDirective({
      el,
      parts: ['bind', 'hidden'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.hidden).toEqual(true);
    state = { hideme: false };
    bindDirective({
      el,
      parts: ['bind', 'hidden'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    expect(el.hidden).toEqual(false);
  });

  it('should accept object format for attributes', () => {
    const el = document.createElement('a');
    const expression = `{ id: 'test', class: 'test', title: 'test', translate: null }`;
    let state = {};
    bindDirective({
      el,
      parts: ['bind'],
      data: {
        value: expression,
        compute: compute(expression, el),
        deps: ['id', 'class', 'title', 'translate'],
      },
      state,
    });
    expect(el.id).toEqual('test');
    expect(el.className).toEqual('test');
    expect(el.title).toEqual('test');
    expect(el.translate).toEqual(null);
  });
});
