import { directives } from '../directive';
import compute from '../utils/compute';
import patch from '../patch';
import h from '../h';

describe('.patch', () => {
  it('should patch a directive', () => {
    const el1 = document.createElement('p');
    const el2 = document.createElement('p');
    const state = {
      baz: 'boo',
      foo() {
        return 'bar';
      },
    };

    patch(
      h('div', [
        h('p', [], {
          attributes: {},
          directives: {
            text: { value: 'this.baz', compute: compute('this.baz', { $el: el1 }) },
            'bind:id': {
              value: 'this.foo()',
              compute: compute('this.foo()', { $el: el1 }),
            },
          },
          ref: el1,
          type: 2,
        }),
        h('p', [], {
          attributes: {},
          directives: {
            text: { value: `'foo'`, compute: compute(`'foo'`, { $el: el1 }) },
          },
          ref: el2,
          type: 1,
        }),
        h('p', [], {
          attributes: {},
          directives: {},
          ref: undefined,
          type: 0, 
        }),
      ]),
      { state, directives }
    );

    expect(el1.textContent).toEqual('boo');
    expect(el1.id).toEqual('bar');
    expect(el2.textContent).toEqual('foo');
  });
});
