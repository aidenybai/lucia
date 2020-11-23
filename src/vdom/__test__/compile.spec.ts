import compile from '../compile';

describe('.compile', () => {
  it('should compile a VNode tree', () => {
    const vdom = compile(document.createElement('div'));

    expect(vdom).toEqual({
      tag: 'div',
      props: {
        attributes: {},
        directives: {},
      },
      children: [],
      type: 0,
    });
  });
});
