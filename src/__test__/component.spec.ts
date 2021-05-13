import { component } from '../component';
import reactive from '../core/reactive';
import { COMPONENT_FLAG } from '../models/generics';

describe('.component', () => {
  it('should create and mount component properly', () => {
    const el = document.createElement('div');
    const state = () => ({ foo: 'bar' });
    const app = component(state);
    app.init(el);

    expect(app).toBeDefined();
  });

  it('should have an empty object as the default state', () => {
    const app = component(() => ({}));

    expect(app.state()).toEqual({});
  });

  it('should have component property on mount', () => {
    const el = document.createElement('div');
    const state = () => ({ foo: 'bar' });
    const app = component(state);
    const c = app.init(el);

    expect(el[COMPONENT_FLAG]).toEqual(c);
  });

  it('should register a watcher', () => {
    const el = document.createElement('div');
    const state = () => ({ foo: 'bar' });
    const app = component(state);
    function custom() {
      return true;
    }
    app.watch('custom', custom);
    const c = app.init(el);

    expect(JSON.stringify({ ...c.state, $render: custom.bind(Object.keys(state())) })).toEqual(
      JSON.stringify(reactive(state(), custom))
    );
    expect({ ...app.watchers }).toEqual({ custom });
  });

  it('should render if render() is manually called', () => {
    const el = document.createElement('div');
    const state = () => ({ foo: 'bar' });
    const app = component(state);
    const c = app.init(el);

    expect(() => c.render()).not.toThrowError();
  });
});
