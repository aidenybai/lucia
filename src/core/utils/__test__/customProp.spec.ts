import { getElementCustomProp, setElementCustomProp } from '../elementCustomProp';

describe('.customProp', () => {
  it('should correctly access custom prop', () => {
    const el = document.createElement('div');

    // @ts-ignore
    el.__l = 'foo';

    expect(getElementCustomProp(el, 'innerHTML')).toEqual('');
    expect(getElementCustomProp(el, '__l')).toEqual('foo');
  });

  it('should correctly mutate custom prop', () => {
    const el = document.createElement('div');

    setElementCustomProp(el, '__l', 'foo');

    expect(getElementCustomProp(el, '__l')).toEqual('foo');
  });
});
