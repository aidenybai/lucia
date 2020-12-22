import { init } from '../index';

describe('.component', () => {
  it('should init without error', () => {
    document.body.innerHTML = '';

    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('l-state', '{ test: 1 }');
    document.body.appendChild(fakeElem);
    init();

    // @ts-ignore
    expect(fakeElem.__l);
  });
  it('should not init if null', () => {
    document.body.innerHTML = '';

    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('l-state', 'null');
    document.body.appendChild(fakeElem);
    init();

    // @ts-ignore
    expect(fakeElem.__l);
  });
});
