import { component, use, init } from '../index';

describe('.component', () => {
  it('should create it properly', () => {
    const comp = component('Counter', () => '<div l-text="this.count"></div>');
    expect(comp.name).toEqual('Counter');
    expect(comp.cb()).toEqual('<div l-text="this.count"></div>');
  });

  it('register use correctly', () => {
    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('l-use', 'App');
    document.body.appendChild(fakeElem);

    expect(use('App', {}));
  });

  it('init without error', () => {
    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('l-init', '{ test: 1 }');
    document.body.appendChild(fakeElem);

    expect(init()).toEqual(undefined);
  });
});
