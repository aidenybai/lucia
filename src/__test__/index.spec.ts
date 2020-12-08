import { init } from '../index';

describe('.component', () => {
  it('init without error', () => {
    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('l-init', '{ test: 1 }');
    document.body.appendChild(fakeElem);

    expect(init()).toEqual(undefined);
  });
});
