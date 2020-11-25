import patch from '../patch';
import h from '../h';

describe('.patch', () => {
  it('should patch a directive', () => {
    const fakeElem = document.createElement('p');

    patch(
      h('div', [
        h('div', [], {
          attributes: {},
          directives: { text: 'this.hello' },
          ref: fakeElem,
          type: 2,
        }),
      ]),
      { hello: 1 }
    );

    expect(fakeElem.textContent).toEqual('1');
  });
});
