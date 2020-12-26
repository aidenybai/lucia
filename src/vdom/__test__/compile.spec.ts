import { compile, flat } from '../compile';
import { VNode } from '../../models/vnode';
import compute from '../utils/compute';

describe('.compile', () => {
  it('should compile a VNode tree', () => {
    const el = document.createElement('div');
    const vdom = compile(el);

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
    const el = document.createElement('div');
    el.setAttribute('l-text', 'this.foo');
    const vdom = compile(el, { foo: 'bar' });
    const compute = jest.fn();

    (vdom as VNode).props.directives.text.compute = compute;

    expect(vdom).toEqual({
      tag: 'div',
      children: [],
      props: {
        attributes: {},
        directives: {
          text: { value: 'this.foo', compute },
        },
        ref: el,
        type: 2,
      },
    });
  });

  it('should throw an error', () => {
    // @ts-ignore
    expect(() => compile()).toThrowError(new Error('Please provide a Element'));
  });

  it('should compile with children', () => {
    const el = document.createElement('div');
    const child = document.createElement('p');
    el.appendChild(child);
    const vdom = compile(el);

    expect(vdom).toEqual({
      tag: 'div',
      children: [
        {
          tag: 'p',
          children: [],
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

  it('should compile components', () => {
    const el = document.createElement('div');
    const child = document.createElement('customcomponent');
    const ref = document.createElement('p');

    child.setAttribute('l-text', 'this.foo');
    ref.setAttribute('l-text', 'this.foo');
    el.appendChild(child);

    const vdom = compile(el, { foo: 'bar' }, { CUSTOMCOMPONENT: () => `<p></p>` });
    const compute = jest.fn();

    (vdom as VNode).props.directives.text.compute = compute;

    expect(vdom).toEqual({
      tag: 'div',
      children: [
        {
          tag: 'p',
          children: [],
          props: {
            attributes: {},
            directives: {
              text: { value: '1', compute },
            },
            ref,
            type: 1,
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

  it('should strip and flat vdom', () => {
    const el = document.createElement('div');
    const child = document.createElement('div');
    const textNode = document.createTextNode('hello world');

    el.appendChild(child);
    child.appendChild(textNode);

    const vdom = compile(el, {}, {}) as VNode;
    const flatVDom = compile(el, {}, {}, true);

    expect(flat(vdom));
    expect(flatVDom).toEqual({
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
});
