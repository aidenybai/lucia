import { component, Component } from '../component';
import reactive from '../core/reactive';
import { directives } from '../core/directive';
import { getCustomProp } from '../core/utils/customProp';

describe('.component', () => {
  it('should create and mount component properly', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    app.mount(el);

    expect(app.state).toEqual(state);
    expect(typeof app.directives).toEqual('object');
    expect(Array.isArray(app.ast)).toEqual(true);
  });

  it('should have an empty object as the default state', () => {
    const app = component({});

    expect(app.state).toEqual({});
  });

  it('should have component() return value equal to new Component instance', () => {
    const app1 = new Component({});
    const app2 = component({});

    expect(app1).toEqual(app2);
    expect(app1.state).toEqual(app2.state);
  });

  it('should return component state on mount', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    const appState = app.mount(el);

    expect(appState).toEqual(state);
  });

  it('should have __l property on mount', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    app.mount(el);

    expect(getCustomProp(el, '__l')).toEqual(app);
  });

  it('should register custom directive', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    function custom() {}
    app.directive('custom', custom);
    app.mount(el);

    expect(app.state).toStrictEqual(reactive(state, custom).proxy);
    expect({ ...app.directives }).toEqual({ ...directives, CUSTOM: custom });
  });

  it('should render if render() is manually called', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    app.mount(el);

    expect(() => app.render()).not.toThrowError();
  });
});
