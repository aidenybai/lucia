import compile from '../compile';

describe('.compile', () => {
  it('should compile a VNode tree', () => {
    const vdom = compile(document.createElement('div'));

    expect(vdom).toEqual({
      tag: 'div',
      children: [],
      props: {
        attributes: {},
        directives: {},
        type: 0,
        ref: undefined,
      },
    });
  });
  it('should detect key in directives', () => {
    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('l-text', 'foo');
    const vdom = compile(fakeElem, { foo: 'bar' });

    expect(vdom).toEqual({
      tag: 'div',
      children: [],
      props: {
        attributes: {},
        directives: {
          text: 'foo'
        },
        type: 2,
        ref: fakeElem,
      },
    });
  });
  it('should throw an error', () => {
    //@ts-ignore
    expect(() => compile()).toThrowError(new Error('Please provide a Element'))
  });
});
