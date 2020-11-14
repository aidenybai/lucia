import { bindDirective } from '../bind';

describe('.bindDirective', () => {
  it('should bind class based on view boolean value', () => {
    const fakeElem = document.createElement('p');
    bindDirective({
      el: fakeElem,
      name: 'l-bind:class',
      value: '{ test }',
      view: { test: true },
    });
    expect(fakeElem.className).toBe('test');
  });

  it('should bind style based on view value', () => {
    const fakeElem = document.createElement('p');
    bindDirective({
      el: fakeElem,
      name: 'l-bind:style',
      value: '{ fontWeight: test }',
      view: { test: 'bold' },
    });
    expect(fakeElem.style.cssText).toBe('font-weight: bold;');
  });

  it('should bind href to anchor tag  based on view value', () => {
    const fakeElem = document.createElement('a');
    bindDirective({
      el: fakeElem,
      name: 'l-bind:href',
      value: 'url',
      view: { url: 'https://example.com/' },
    });
    expect(fakeElem.href).toBe('https://example.com/');
  });

  it('should allow boolean input for attributes', () => {
    const fakeElem = document.createElement('a');
    bindDirective({
      el: fakeElem,
      name: 'l-bind:hidden',
      value: 'hideme',
      view: { hideme: true },
    });
    expect(fakeElem.hidden).toBe(true);
  });
});
