import { createApp, App } from '../App';

describe('.App', () => {
  it('should create and mount app properly', () => {
    const fakeElem = document.createElement('div');
    const view = { test: 1 };
    const newView = createApp(view).mount(fakeElem, true);
    expect(view).toBe(newView);
  });
  it('should have an empty object as the default view', () => {
    const app = new App();
    expect(app.view).toEqual({});
  });
});
