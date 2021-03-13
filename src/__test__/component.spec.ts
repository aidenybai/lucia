import { component, Component } from '../component';
import reactive from '../core/reactive';
import { directives } from '../core/directive';
import { getElementCustomProp } from '../core/utils/elementCustomProp';

describe('.component', () => {
  it('should create and mount component properly', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    app.mount(el);

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

  it('should have component property on mount', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    app.mount(el);

    expect(getElementCustomProp(el, 'component')).toEqual(app);
  });

  it('should register custom directive', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    function custom() {}
    app.directive('custom', custom);
    app.mount(el);

    expect(JSON.stringify({ ...app.state, $render: custom.bind(Object.keys(state)) })).toEqual(
      JSON.stringify(reactive(state, custom))
    );
    expect({ ...app.directives }).toEqual({ ...directives, CUSTOM: custom });
  });

  it('should register a watcher', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    function custom() {}
    app.watch('custom', custom);
    app.mount(el);

    expect(JSON.stringify({ ...app.state, $render: custom.bind(Object.keys(state)) })).toEqual(
      JSON.stringify(reactive(state, custom))
    );
    expect({ ...app.watchers }).toEqual({ custom });
  });

  it('should render if render() is manually called', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    app.mount(el);

    expect(() => app.render()).not.toThrowError();
  });
});
