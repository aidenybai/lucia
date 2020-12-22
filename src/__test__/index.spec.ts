import { init, listen } from '../index';

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
  it('should listen and init at runtime', () => {
    document.body.innerHTML = '';

    const fakeElem1 = document.createElement('div');
    fakeElem1.setAttribute('l-state', '{}');
    document.body.appendChild(fakeElem1);
    init();
    listen((el: HTMLElement) => init(el));

    const fakeElem2 = document.createElement('div');
    fakeElem2.setAttribute('l-state', '{}');
    document.body.appendChild(fakeElem2);

    // @ts-ignore
    expect(fakeElem1.__l);
    // @ts-ignore
    expect(fakeElem2.__l);
  });
});
