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

  it('should join as text', () => {
    const fakeElem = document.createElement('p');
    joinDirective({
      el: fakeElem,
      name: 'l-join',
      value: `this.li as text`,
      view: { li: ['1', '2', '3'] },
    });
    expect(fakeElem.innerText).toBe('123');
  });
});
