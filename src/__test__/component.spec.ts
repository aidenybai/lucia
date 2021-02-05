import { component, Component } from '../component';
import reactive from '../core/reactive';
import { directives } from '../core/directive';

describe('.component', () => {
  it('should create and mount app properly', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    app.mount(el);
    expect(app.state).toEqual(state);
  });

  it('should have an empty object as the default state', () => {
    const app = component({});
    expect(app.state).toEqual({});
  });

  it('should have createApp return value equal to new App instance', () => {
    const app1 = new Component({});
    const app2 = component({});
    expect(app1).toEqual(app2);
    expect(app1.state).toEqual(app2.state);
  });

  it('should return app state on mount', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    const appState = app.mount(el);
    expect(appState).toEqual(state);
  });

  it('should register custom directive', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    app.directive('custom', () => {});
    app.mount(el);

    expect(app.state).toStrictEqual(reactive(state, () => {}).proxy);
    expect(JSON.stringify(app.directives)).toEqual(
      JSON.stringify({ ...directives, CUSTOM: () => {} })
    );
  });
});
