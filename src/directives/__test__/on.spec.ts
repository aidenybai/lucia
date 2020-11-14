import { onDirective } from '../on';

describe('.onDirective', () => {
  it('should attach onclick', () => {
    const fakeElem = document.createElement('button');
    onDirective({
      el: fakeElem,
      name: 'l-on:click',
      value: 'test()',
      view: {
        test() {
          return 0;
        },
      },
    });
    expect(typeof fakeElem.onclick).toBe('function');
  });
});
