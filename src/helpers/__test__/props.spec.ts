import getProps from '../props';

describe('.getProps', () => {
  it('should get the props of an element', () => {
    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('name', '0');
    fakeElem.setAttribute('l-text', '1');
    expect(JSON.stringify(getProps(fakeElem))).toBe(
      JSON.stringify({
        attributes: { name: '0' },
        directives: { text: '1' },
      })
    );
  });
});
