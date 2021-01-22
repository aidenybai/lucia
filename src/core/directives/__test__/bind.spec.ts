import { bindDirective } from '../bind';
import compute from '../../utils/computeExpression';

describe('.bindDirective', () => {
  it('should bind class based on state boolean value', () => {
    const el = document.createElement('p');
    const expression = '{ test: test }';
    const state = { test: true };
    bindDirective({
      el,
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, el), keys: [] },
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
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, el), keys: [] },
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
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, el), keys: [] },
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
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, el), keys: [] },
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
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, el), keys: [] },
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
      name: 'l-bind:style',
      data: { value: expression, compute: compute(expression, el), keys: [] },
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
      name: 'l-bind:href',
      data: { value: expression, compute: compute(expression, el), keys: [] },
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
      name: 'l-bind:hidden',
      data: { value: expression, compute: compute(expression, el), keys: [] },
      state,
    });
    expect(el.hidden).toEqual(true);
    state = { hideme: false };
    bindDirective({
      el,
      name: 'l-bind:hidden',
      data: { value: expression, compute: compute(expression, el), keys: [] },
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
      name: 'l-bind',
      data: {
        value: expression,
        compute: compute(expression, el),
        keys: ['id', 'class', 'title', 'translate'],
      },
      state,
    });
    expect(el.id).toEqual('test');
    expect(el.className).toEqual('test');
    expect(el.title).toEqual('test');
    expect(el.translate).toEqual(null);
  });
});
