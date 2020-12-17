import props from '../props';
import compute from '../compute';

describe('.props', () => {
  it('should get the props of an element', () => {
    const fakeElem = document.createElement('div');
    fakeElem.setAttribute('name', '0');
    fakeElem.setAttribute(`l-text`, '1');
    expect(JSON.stringify(props(fakeElem))).toEqual(
      JSON.stringify({
        attributes: { name: '0' },
        directives: { text: { value: '1', run: compute('1', {}) } },
      })
    );
  });
});
