import { directives } from '../directive';
import compute from '../utils/compute';
import patch from '../patch';
import h from '../h';

describe('.patch', () => {
  it('should patch a directive', () => {
    const fakeElem1 = document.createElement('p');
    const fakeElem2 = document.createElement('p');
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
            text: { value: 'this.hello', compute: compute('this.hello', { $el: fakeElem1 }) },
            'bind:id': {
              value: 'this.foo()',
              compute: compute('this.foo()', { $el: fakeElem1 }),
            },
          },
          ref: fakeElem1,
          type: 2,
        }),
        h('p', [], {
          attributes: {},
          directives: {
            text: { value: `'foo'`, compute: compute(`'foo'`, { $el: fakeElem1 }) },
          },
          ref: fakeElem2,
          type: 1,
        }),
        h('p', [], {
          attributes: {},
          directives: {},
          ref: undefined,
          type: 0,
        }),
      ]),
      state,
      directives
    );

    expect(fakeElem1.textContent).toEqual('1');
    expect(fakeElem1.id).toEqual('bar');
    expect(fakeElem2.textContent).toEqual('foo');
  });
});
