import patch from '../patch';
import h from '../h';

describe('.patch', () => {
  it('should patch a directive', () => {
    const fakeElem = document.createElement('p');

    patch(h('div', {}, {}, [h('p', {}, { text: 'hello' }, [], 2, fakeElem)]), { hello: 1 });

    expect(fakeElem.textContent).toEqual('1');
  });
});
