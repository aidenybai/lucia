import { init } from '../index';
import { getElementCustomProp } from '../core/utils/elementCustomProp';

// @ts-expect-error
window.callback = jest.fn();

describe('.index', () => {
  it('should create component scope and attach component prop', async () => {
    const root = document.createElement('div');
    const el = document.createElement('div');
    const fakeEl = document.createElement('div');

    el.setAttribute('l-state', `{ foo: 'bar' }`);
    root.appendChild(el);

    expect(getElementCustomProp(el, 'component')).toBeUndefined();

    init(fakeEl);
    expect(getElementCustomProp(el, 'component')).toBeUndefined();

    init(root);
    expect(getElementCustomProp(el, 'component')).toBeDefined();
  });

  it('should create component with empty state', async () => {
    const root = document.createElement('div');
    const el = document.createElement('div');

    el.setAttribute('l-state', '');
    root.appendChild(el);

    init(root);

    const $render = () => {};

    expect(JSON.stringify(getElementCustomProp(el, 'component').state)).toEqual(
      JSON.stringify({
        $render: $render.bind([]),
      })
    );
  });

  it('should throw error on init', () => {
    // @ts-expect-error
    window.originalConsole = console;
    window.console = { warn: jest.fn() } as any;

    const root = document.createElement('div');
    const el = document.createElement('div');

    el.setAttribute('l-state', '{ shouldThrowAnError }');
    root.appendChild(el);
    init(root);

    expect(console.warn).toBeCalled();

    // @ts-expect-error
    window.console = window.originalConsole;
  });
});
