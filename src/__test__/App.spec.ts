import { createApp, App } from '../App';
import reactive from '../vdom/reactive';
import { directives } from '../vdom/directive';

describe('.App', () => {
  it('should create and mount app properly', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = createApp(state);
    app.mount(el, true);
    expect(app.state).toBe(state);
  });

  it('should have an empty object as the default state', () => {
    const app = createApp({});
    expect(app.state).toEqual({});
  });

  it('should have createApp return value equal to new App instance', () => {
    const app1 = new App({});
    const app2 = createApp({});
    expect(app1).toEqual(app2);
  });

  it('should return app state on mount', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = createApp(state);
    const appState = app.mount(el, true);
    expect(appState).toEqual(state);
  });
  it('should call mountHook when app is mounted', () => {
    const el = document.createElement('div');
    const mountHook = jest.fn();
    const app = createApp({}, mountHook);
    expect(mountHook.mock.calls.length).toEqual(0);
    app.mount(el);
    expect(mountHook.mock.calls.length).toEqual(1);
  });

  it('should create a component on an app', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = createApp(state);
    app.component(
      'Counter',
      ({ children }: Record<string, string>) => `<div l-text="this.foo">${children}</div>`
    );
    app.mount(el, true);
    expect(app.components.COUNTER({ children: '' })).toEqual('<div l-text="this.foo"></div>');
    expect(app.components.COUNTER({ children: 'bar' })).toEqual('<div l-text="this.foo">bar</div>');
    expect(app.components.Counter).toEqual(undefined);
    expect(Object.keys(app.components).length).toEqual(1);
  });

  it('should create a directive', () => {
    const state = { foo: 'bar' };
    const app = createApp(state);
    app.directive('foo', () => {});
    expect(typeof app.directives.FOO).toEqual('function');
    expect(app.directives.FOO()).toEqual(undefined);
    expect(app.directives.foo).toEqual(undefined);
    expect(Object.keys(app.directives).length).toEqual(1);
  });

  it('should should create a non-shallow app instance', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = createApp(state);
    const shallowApp = createApp(state);
    app.mount(el);
    shallowApp.mount(el, true);

    expect(app.state).toStrictEqual(reactive(state, app.patch));
    expect(app.directives).toEqual(directives);
    expect(shallowApp.state).toStrictEqual(state);
    expect(shallowApp.directives).toEqual({});
  });
});
