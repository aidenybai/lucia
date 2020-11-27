import { h, render } from '../h';

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
        ref: undefined,
      },
    });
  });
  it('should trim the class', () => {
    const vdom = h('div', undefined, {
      attributes: { className: '  foo  bar a f random-class-here    ' },
      directives: {},
      type: 0,
    });

    expect(vdom).toEqual({
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
  it('should parse and apply the selector', () => {
    const vdom = h('div.class1.class2.class3#id[foo=bar]');

    expect(vdom).toEqual({
      tag: 'div',
      children: [],
      props: {
        attributes: {
          className: 'class1 class2 class3',
          id: 'id',
          foo: 'bar',
        },
        directives: {},
        type: 0,
        ref: undefined,
      },
    });
  });
  it('should render the virtual nodes', () => {
    const vdom = h('div.class1.class2.class3#id[foo=bar][l-text=foo]', ['text', h('div')]);

    expect(render(vdom).outerHTML).toEqual(
      '<div id="id" foo="bar" class="class1 class2 class3" l-text="foo">text<div></div></div>'
    );
  });
});
