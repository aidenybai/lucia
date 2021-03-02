import { getElementCustomProp, setElementCustomProp } from '../elementCustomProp';

describe('.customProp', () => {
  it('should correctly access custom prop', () => {
    const el = document.createElement('div');

    // @ts-expect-error
    el.component = 'foo';

    expect(getElementCustomProp(el, 'innerHTML')).toEqual('');
    expect(getElementCustomProp(el, 'component')).toEqual('foo');
  });

  it('should correctly mutate custom prop', () => {
    const el = document.createElement('div');

    setElementCustomProp(el, 'component', 'foo');

    expect(getElementCustomProp(el, 'component')).toEqual('foo');
  });
});
