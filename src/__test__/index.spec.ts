import { COMPONENT_FLAG } from '../models/generics';
import { Component } from '../component';
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

    expect(el[COMPONENT_FLAG]).toBeUndefined();

    init(fakeEl);
    expect(el[COMPONENT_FLAG]).toBeUndefined();

    init(root);
    expect(el[COMPONENT_FLAG]).toBeDefined();
  });

  it('should default to document', async () => {
    const el = document.createElement('div');

    el.setAttribute('l-state', '');
    document.body.append(el);

    init();

    const $render = () => {
      return true;
    };

    expect(JSON.stringify((el[COMPONENT_FLAG] as Component).state)).toEqual(
      JSON.stringify({
        $render: $render.bind([]),
      }),
    );

    document.body.innerHTML = '';
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

    expect(JSON.stringify((el[COMPONENT_FLAG] as Component).state)).toEqual(
      JSON.stringify({
        $render: $render.bind([]),
      }),
    );
  });
});
