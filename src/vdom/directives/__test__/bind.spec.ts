import { bindDirective } from '../bind';

describe('.bindDirective', () => {
  it('should bind class based on state boolean value', () => {
    const fakeElem = document.createElement('p');
    bindDirective({
      el: fakeElem,
      name: 'l-bind:class',
      value: '{ test: this.test }',
      state: { test: true },
    });
    expect(fakeElem.className).toBe('test');
  });
  it('should retain original className prop', () => {
    const fakeElem = document.createElement('p');
    fakeElem.className = 'test2';
    bindDirective({
      el: fakeElem,
      name: 'l-bind:class',
      value: '{ test: this.test }',
      state: { test: false },
    });
    expect(fakeElem.className).toBe('test2');
  });
  it('should not have className prop', () => {
    const fakeElem = document.createElement('p');
    bindDirective({
      el: fakeElem,
      name: 'l-bind:class',
      value: '{ test: this.test }',
      state: { test: false },
    });
    expect(fakeElem.className).toBe('');
  });
  it('should accept string for class', () => {
    const fakeElem = document.createElement('p');
    bindDirective({
      el: fakeElem,
      name: 'l-bind:class',
      value: 'this.test',
      state: { test: 'foo' },
    });
    expect(fakeElem.className).toBe('foo');
  });
  it('should accept array for class', () => {
    const fakeElem = document.createElement('p');
    bindDirective({
      el: fakeElem,
      name: 'l-bind:class',
      value: 'this.test',
      state: { test: ['foo', 'bar', 'baz'] },
    });
    expect(fakeElem.className).toBe('foo bar baz');
  });
  it('should bind style based on state value', () => {
    const fakeElem = document.createElement('p');
    bindDirective({
      el: fakeElem,
      name: 'l-bind:style',
      value: '{ fontWeight: this.test }',
      state: { test: 'bold' },
    });
    expect(fakeElem.style.cssText).toBe('font-weight: bold;');
  });
  it('should bind href to anchor tag based on state value', () => {
    const fakeElem = document.createElement('a');
    bindDirective({
      el: fakeElem,
      name: 'l-bind:href',
      value: 'this.url',
      state: { url: 'https://example.com/' },
    });
    expect(fakeElem.href).toBe('https://example.com/');
  });
  it('should allow boolean input for attributes', () => {
    const fakeElem = document.createElement('a');
    bindDirective({
      el: fakeElem,
      name: 'l-bind:hidden',
      value: 'this.hideme',
      state: { hideme: true },
    });
    expect(fakeElem.hidden).toBe(true);
    bindDirective({
      el: fakeElem,
      name: 'l-bind:hidden',
      value: 'this.hideme',
      state: { hideme: false },
    });
    expect(fakeElem.hidden).toBe(false);
  });
});
