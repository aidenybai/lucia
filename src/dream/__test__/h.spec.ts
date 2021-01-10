import { h } from '../h';

describe('.h', () => {
  it('should render VNodes', () => {
    const ast = h('div');

    expect(ast).toEqual({
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
    const ast = h('div', [h('p', ['foo'])]);

    expect(ast).toEqual({
      tag: 'div',
      children: [
        {
          tag: 'p',
          children: ['foo'],
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
    const ast = h('div', 'foo');

    expect(ast).toEqual({
      tag: 'div',
      children: ['foo'],
      props: {
        attributes: {},
        directives: {},
        type: 0,
        ref: undefined,
      },
    });
  });

  it('should trim the class', () => {
    const ast = h('div', undefined, {
      attributes: { className: '  foo  bar a f random-class-here    ' },
      directives: {},
      type: 0,
    });

    expect(ast).toEqual({
      tag: 'div',
      children: [],
      props: {
        attributes: {
          className: 'foo  bar a f random-class-here',
        },
        directives: {},
        type: 0,
        ref: undefined,
      },
    });
  });
});
