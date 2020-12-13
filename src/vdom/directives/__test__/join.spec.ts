import { joinDirective } from '../join';

describe('.joinDirective', () => {
  it('should join the state array into HTML', () => {
    const fakeElem = document.createElement('ul');
    joinDirective({
      el: fakeElem,
      name: 'l-join',
      value: `this.li`,
      state: { li: ['<li>test</li>', '<li>test</li>', '<li>test</li>'] },
    });
    expect(fakeElem.innerHTML).toBe('<li>test</li><li>test</li><li>test</li>');
  });

  it('should join as text', () => {
    const fakeElem = document.createElement('p');
    joinDirective({
      el: fakeElem,
      name: 'l-join',
      value: `this.li as text`,
      state: { li: ['1', '2', '3'] },
    });
    expect(fakeElem.innerText).toBe('123');
  });
});
