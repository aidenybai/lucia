import { directives } from '../directive';
import patch from '../patch';
import h from '../h';

describe('.patch', () => {
  it('should patch a directive', () => {
    const fakeElem1 = document.createElement('p');
    const fakeElem2 = document.createElement('p');

    patch(
      h('div', [
        h('p', [], {
          attributes: {},
          directives: { text: 'this.hello', 'bind:id': 'this.foo()' },
          ref: fakeElem1,
          type: 2,
        }),
        h('p', [], {
          attributes: {},
          directives: { text: `'foo'` },
          ref: fakeElem2,
          type: 1,
        }),
      ]),
      {
        hello: 1,
        foo() {
          return 'bar';
        },
      },
      directives
    );

    expect(fakeElem1.textContent).toEqual('1');
    expect(fakeElem1.id).toEqual('bar');
    expect(fakeElem2.textContent).toEqual('foo');
  });
});
