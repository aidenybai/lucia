import { init } from '../index';

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
});
