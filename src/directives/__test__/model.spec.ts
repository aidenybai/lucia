import { modelDirective } from '../model';

describe('.modelDirective', () => {
  it('should attach and model input', () => {
    const fakeElem = document.createElement('button');
    modelDirective({
      el: fakeElem,
      name: 'l-model',
      value: 'this.test',
      view: {
        test: 0,
      },
    });
    expect(typeof fakeElem.oninput).toBe('function');
  });
});
