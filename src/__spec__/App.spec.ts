import { createApp } from '../App';

describe('.App', () => {
  it('should create and mount app properly', () => {
    const fakeElem = document.createElement('div');
    const view = { test: 1 };
    const newView = createApp(view).mount(fakeElem, true);
    expect(view).toBe(newView);
  });
});
