import { COMPONENT_FLAG } from '../../../models/generics';

describe('.customProp', () => {
  it('should correctly access custom prop', () => {
    const el = document.createElement('div');

    // @ts-expect-error: .component doesn't exist on HTMLElement
    el.component = 'foo';

    expect(el.innerHTML).toEqual('');
    expect(el[COMPONENT_FLAG]).toEqual('foo');
  });

  it('should correctly mutate custom prop', () => {
    const el = document.createElement('div');

    el[COMPONENT_FLAG] = 'foo';

    expect(el[COMPONENT_FLAG]).toEqual('foo');
  });
});
