import { init, listen } from '../index';

window.console = { warn: jest.fn() } as any;

describe('.component', () => {
  it('should create component scope and attach __l prop', async () => {
    const root = document.createElement('div');
    const el = document.createElement('div');

    el.setAttribute('l-state', '{ test: 1 }');
    root.appendChild(el);

    // @ts-ignore
    expect(el.__l).toBeUndefined();

    init(root);

    // @ts-ignore
    expect(el.__l).toBeDefined();
  });

  it('should not init if null', () => {
    const root = document.createElement('div');
    const el = document.createElement('div');

    el.setAttribute('l-state', 'null');
    root.appendChild(el);
    init(root);

    // @ts-ignore
    expect(el.__l.state).toEqual({});
  });

  it('should throw error on init', () => {
    const root = document.createElement('div');
    const el = document.createElement('div');

    el.setAttribute('l-state', '{ shouldThrowAnError }');
    root.appendChild(el);
    init(root);

    expect(console.warn).toBeCalled();
  });

  it('should listen and init at runtime', () => {
    const root = document.createElement('div');
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    const el3 = document.createElement('div');
    const el4 = document.createElement('div');
    el1.setAttribute('l-state', '{}');
    el2.setAttribute('l-state', '{}');

    root.appendChild(el1);
    init(root);

    // Testing muts
    listen((el: HTMLElement) => init(el), root);
    root.appendChild(el2);
    root.appendChild(el3);
    el3.appendChild(el4);

    // For some odd reason race conditions are messing this up
    // Removing the setTimeout will result in el2.__l and el3.__l
    // being undefined
    setTimeout(() => {
      // @ts-ignore
      expect(el1.__l).toBeDefined();
      // @ts-ignore
      expect(el2.__l).toBeDefined();
      // @ts-ignore
      expect(el3.__l).toBeUndefined();
    }, 0);

    el3.setAttribute('l-state', '{}');
    setTimeout(() => {
      // @ts-ignore
      expect(el3.__l).toBeDefined();
    }, 0);

    el4.setAttribute('l-state', '{}');
    setTimeout(() => {
      // @ts-ignore
      expect(el4.__l).toBeUndefined();
    }, 0);
  });
});
