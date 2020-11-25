import h from '../h';

describe('.h', () => {
  it('should render VNodes', () => {
    const vdom = h('div');

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
  it('should set children', () => {
    const vdom = h('div', [h('p', ['Foo!'])]);

    expect(vdom).toEqual({
      tag: 'div',
      children: [
        {
          tag: 'p',
          children: ['Foo!'],
          props: {
            attributes: {},
            directives: {},
            type: 0,
            ref: undefined,
          },
        },
      ],
      props: {
        attributes: {},
        directives: {},
        type: 0,
        ref: undefined,
      },
    });
  });
  it('should allow a string for children', () => {
    const vdom = h('div', 'Foo!');

    expect(vdom).toEqual({
      tag: 'div',
      children: ['Foo!'],
      props: {
        attributes: {},
        directives: {},
        type: 0,
        ref: undefined
      }
    })
  });
  it('should trim the class', () => {
    const vdom = h('div', undefined, { attributes: { className: '  foo  bar a f random-class-here    ' }, directives: {}, type: 0 });

    expect(vdom).toEqual({
      tag: 'div',
      children: [],
      props: {
        attributes: {
          className: 'foo  bar a f random-class-here'
        },
        directives: {},
        type: 0,
        ref: undefined
      }
    })
  })
});
