import { bindDirective } from '../bind';
import compute from '../../utils/compute';

describe('.bindDirective', () => {
  it('should bind class based on state boolean value', () => {
    const el = document.createElement('p');
    const expression = '{ test: this.test }';
    const state = { test: true };
    bindDirective({
      el,
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.className).toBe('test');
  });

  it('should retain original className prop', () => {
    const el = document.createElement('p');
    const expression = '{ test: this.test }';
    const state = { test: false };
    el.className = 'test2';
    bindDirective({
      el,
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.className).toBe('test2');
  });

  it('should not have className prop', () => {
    const el = document.createElement('p');
    const expression = '{ test: this.test }';
    const state = { test: false };
    bindDirective({
      el,
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.className).toBe('');
  });

  it('should accept string for class', () => {
    const el = document.createElement('p');
    const expression = 'this.test';
    const state = { test: 'foo' };
    bindDirective({
      el,
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.className).toBe('foo');
  });

  it('should accept array for class', () => {
    const el = document.createElement('p');
    const expression = 'this.test';
    const state = { test: ['foo', 'bar', 'baz'] };
    bindDirective({
      el,
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.className).toBe('foo bar baz');
  });

  it('should bind style based on state value', () => {
    const el = document.createElement('p');
    const expression = '{ fontWeight: this.test }';
    const state = { test: 'bold' };
    bindDirective({
      el,
      name: 'l-bind:style',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.style.cssText).toBe('font-weight: bold;');
  });

  it('should bind href to anchor tag based on state value', () => {
    const el = document.createElement('a');
    const expression = 'this.url';
    const state = { url: 'https://example.com/' };
    bindDirective({
      el,
      name: 'l-bind:href',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.href).toBe('https://example.com/');
  });

  it('should allow boolean input for attributes', () => {
    const el = document.createElement('a');
    const expression = 'this.hideme';
    let state = { hideme: true };
    bindDirective({
      el,
      name: 'l-bind:hidden',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.hidden).toBe(true);
    state = { hideme: false };
    bindDirective({
      el,
      name: 'l-bind:hidden',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.hidden).toBe(false);
  });
  
  it('should accept object format for attributes', () => {
    const el = document.createElement('a');
    const expression = `{ id: 'test', class: 'test', title: 'test', translate: null }`;
    let state = {};
    bindDirective({
      el,
      name: 'l-bind',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.id).toBe('test');
    expect(el.className).toBe('test');
    expect(el.title).toBe('test');
    expect(el.translate).toBe(null);
  });
});
