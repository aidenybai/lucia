import { COMPONENT_FLAG } from '../models/generics';
import { Component } from '../component';
import { getElementCustomProp } from '../core/utils/elementCustomProp';
import { init } from '../index';

// @ts-expect-error: callback doesn't exist on window, but good enough for test
window.callback = jest.fn();

describe('.index', () => {
  it('should create component scope and attach component prop', async () => {
    const root = document.createElement('div');
    const el = document.createElement('div');
    const fakeEl = document.createElement('div');

    el.setAttribute('l-state', `{ foo: 'bar' }`);
    root.appendChild(el);

    expect(getElementCustomProp(el, COMPONENT_FLAG)).toBeUndefined();

    init(fakeEl);
    expect(getElementCustomProp(el, COMPONENT_FLAG)).toBeUndefined();

    init(root);
    expect(getElementCustomProp(el, COMPONENT_FLAG)).toBeDefined();
  });

  it('should create component with empty state', async () => {
    const root = document.createElement('div');
    const el = document.createElement('div');

    el.setAttribute('l-state', '');
    root.appendChild(el);

    init(root);

    const $render = () => {
      return true;
    };

    expect(JSON.stringify((getElementCustomProp(el, COMPONENT_FLAG) as Component).state)).toEqual(
      JSON.stringify({
        $render: $render.bind([]),
      })
    );
  });

  it('should throw error on init', () => {
    // @ts-expect-error: originalConsole doesn't exist on window, but good enough for test
    window.originalConsole = console;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.console = { warn: jest.fn() } as any;

    const root = document.createElement('div');
    const el = document.createElement('div');

    el.setAttribute('l-state', '{ shouldThrowAnError }');
    root.appendChild(el);
    init(root);

    expect(console.warn).toBeCalled();

    // @ts-expect-error: cannot override console on window, but good enough for test
    window.console = window.originalConsole;
  });
});
