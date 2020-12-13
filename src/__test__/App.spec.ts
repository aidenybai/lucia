import { createApp, App } from '../App';

describe('.App', () => {
  it('should create and mount app properly', () => {
    const fakeElem = document.createElement('div');
    const state = { test: 1 };
    const newState = createApp(state).mount(fakeElem, true);
    expect(state).toBe(newState);
  });
  it('should have an empty object as the default state', () => {
    const app = new App();
    expect(app.state).toEqual({});
  });
  it('should set a component', () => {
    const fakeElem = document.createElement('div');
    const state = { test: 1 };
    const app = createApp(state);
    app.component('Counter', () => '<div l-text="this.count"></div>');
    app.mount(fakeElem, true);
    expect(app.components['COUNTER']()).toBe('<div l-text="this.count"></div>');
  });
  it('should set a directive', () => {
    const state = { test: 1 };
    const app = createApp(state);
    app.directive('foo', () => {});
    expect(typeof app.directives.FOO).toBe('function');
  });
});
