import { component } from '../component';
import { COMPONENT_FLAG } from '../models/generics';

describe('.component', () => {
  it('should create and mount component properly', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    app.mount(el);

    expect(app).toBeDefined();
  });

  it('should have an empty object as the default state', () => {
    const app = component({});

    expect(app.state).toEqual({});
  });

  it('should have component property on mount', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    app.mount(el);

    expect(el[COMPONENT_FLAG]).toEqual(app);
  });

  it('should render if render() is manually called', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    const app = component(state);
    app.mount(el);

    expect(() => app.render()).not.toThrowError();
  });
});
