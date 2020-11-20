import props from '../helpers/props';

describe('.props', () => {
  it('should get the props of an element', () => {
    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('name', '0');
    fakeElem.setAttribute(`l-text`, '1');
    expect(props(fakeElem)).toEqual({
      attributes: { name: '0' },
      directives: { text: '1' },
    });
  });
});
