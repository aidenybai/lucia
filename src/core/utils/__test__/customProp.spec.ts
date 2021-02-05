import { getCustomProp, setCustomProp } from '../customProp';

describe('.customProp', () => {
  it('should correctly access custom prop', () => {
    const el = document.createElement('div');

    // @ts-ignore
    el.__l = 'foo';

    expect(getCustomProp(el, 'innerHTML')).toEqual('');
    expect(getCustomProp(el, '__l')).toEqual('foo');
  });

  it('should correctly mutate custom prop', () => {
    const el = document.createElement('div');

    setCustomProp(el, '__l', 'foo');

    expect(getCustomProp(el, '__l')).toEqual('foo');
  });
});
