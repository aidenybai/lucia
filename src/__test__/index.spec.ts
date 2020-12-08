import { init } from '../index';

describe('.component', () => {
  it('should init without error', () => {
    document.body.innerHTML = '';

    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('l-use', '{ test: 1 }');
    document.body.appendChild(fakeElem);

    expect(init().length).toEqual(1);
  });
  it('should not init automatic initiable elements', () => {
    document.body.innerHTML = '';

    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('l-init', '{ test: 1 }');
    document.body.appendChild(fakeElem);

    expect(init().length).toEqual(0);
  });
  it('should not init if null', () => {
    document.body.innerHTML = '';

    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('l-use', 'null');
    document.body.appendChild(fakeElem);

    expect(init().length).toEqual(0);
  });
  it('should init custom directive', () => {
    document.body.innerHTML = '';

    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('l-customuse', '{ test: 1 }');
    document.body.appendChild(fakeElem);

    expect(init(document, 'customuse').length).toEqual(1);
  });
});
