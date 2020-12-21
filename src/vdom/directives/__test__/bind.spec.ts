import { bindDirective } from '../bind';
import compute from '../../utils/compute';

describe('.bindDirective', () => {
  it('should bind class based on state boolean value', () => {
    const fakeElem = document.createElement('p');
    const expression = '{ test: this.test }';
    const state = { test: true };
    bindDirective({
      el: fakeElem,
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      app: { state },
    });
    expect(fakeElem.className).toBe('test');
  });
  it('should retain original className prop', () => {
    const fakeElem = document.createElement('p');
    const expression = '{ test: this.test }';
    const state = { test: false };
    fakeElem.className = 'test2';
    bindDirective({
      el: fakeElem,
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      app: { state },
    });
    expect(fakeElem.className).toBe('test2');
  });
  it('should not have className prop', () => {
    const fakeElem = document.createElement('p');
    const expression = '{ test: this.test }';
    const state = { test: false };
    bindDirective({
      el: fakeElem,
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      app: { state },
    });
    expect(fakeElem.className).toBe('');
  });
  it('should accept string for class', () => {
    const fakeElem = document.createElement('p');
    const expression = 'this.test';
    const state = { test: 'foo' };
    bindDirective({
      el: fakeElem,
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      app: { state },
    });
    expect(fakeElem.className).toBe('foo');
  });
  it('should accept array for class', () => {
    const fakeElem = document.createElement('p');
    const expression = 'this.test';
    const state = { test: ['foo', 'bar', 'baz'] };
    bindDirective({
      el: fakeElem,
      name: 'l-bind:class',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      app: { state },
    });
    expect(fakeElem.className).toBe('foo bar baz');
  });
  it('should bind style based on state value', () => {
    const fakeElem = document.createElement('p');
    const expression = '{ fontWeight: this.test }';
    const state = { test: 'bold' };
    bindDirective({
      el: fakeElem,
      name: 'l-bind:style',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      app: { state },
    });
    expect(fakeElem.style.cssText).toBe('font-weight: bold;');
  });
  it('should bind href to anchor tag based on state value', () => {
    const fakeElem = document.createElement('a');
    const expression = 'this.url';
    const state = { url: 'https://example.com/' };
    bindDirective({
      el: fakeElem,
      name: 'l-bind:href',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      app: { state },
    });
    expect(fakeElem.href).toBe('https://example.com/');
  });
  it('should allow boolean input for attributes', () => {
    const fakeElem = document.createElement('a');
    const expression = 'this.hideme';
    let state = { hideme: true };
    bindDirective({
      el: fakeElem,
      name: 'l-bind:hidden',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      app: { state },
    });
    expect(fakeElem.hidden).toBe(true);
    state = { hideme: false };
    bindDirective({
      el: fakeElem,
      name: 'l-bind:hidden',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      app: { state },
    });
    expect(fakeElem.hidden).toBe(false);
  });
  it('should accept object format for attributes', () => {
    const fakeElem = document.createElement('a');
    const expression = `{ id: 'test', class: 'test', title: 'test', translate: null }`;
    let state = {};
    bindDirective({
      el: fakeElem,
      name: 'l-bind',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      app: { state },
    });
    expect(fakeElem.id).toBe('test');
    expect(fakeElem.className).toBe('test');
    expect(fakeElem.title).toBe('test');
    expect(fakeElem.translate).toBe(null);
  });
});
