import { joinDirective } from '../join';

describe('.joinDirective', () => {
  it('should join the view array into HTML', () => {
    const fakeElem = document.createElement('ul');
    joinDirective({
      el: fakeElem,
      name: 'l-join',
      value: `this.li`,
      view: { li: ['<li>test</li>', '<li>test</li>', '<li>test</li>'] },
    });
    expect(fakeElem.innerHTML).toBe('<li>test</li><li>test</li><li>test</li>');
  });
});
