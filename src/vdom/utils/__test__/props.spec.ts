import props from '../props';
import compute from '../compute';

describe('.props', () => {
  it('should get the props of an element', () => {
    const el = document.createElement('div');
    el.setAttribute('name', '0');
    el.setAttribute(`l-text`, '1');
    expect(JSON.stringify(props(el))).toEqual(
      JSON.stringify({
        attributes: { name: '0' },
        directives: { text: { value: '1', compute: compute('1', {}) } },
      })
    );
  });
});
