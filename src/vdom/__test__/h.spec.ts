import h from '../h';

describe('.h', () => {
  it('should render VNodes', () => {
    const vdom = h('div');

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
