import { directives } from '../directive';
import compute from '../utils/compute';
import patch from '../patch';
import h from '../h';

describe('.patch', () => {
  it('should patch a directive', () => {
    const el1 = document.createElement('p');
    const el2 = document.createElement('p');
    const state = {
      hello: 1,
      foo() {
        return 'bar';
      },
    };

    patch(
      h('div', [
        h('p', [], {
          attributes: {},
          directives: {
            text: { value: 'this.hello', compute: compute('this.hello', { $el: el1 }) },
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

    expect(el1.textContent).toEqual('1');
    expect(el1.id).toEqual('bar');
    expect(el2.textContent).toEqual('foo');
  });
});
