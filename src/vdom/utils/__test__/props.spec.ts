import props from '../props';

describe('.props', () => {
  it('should get the props of an element', () => {
    const el = document.createElement('div');
    const compute = jest.fn();
    el.setAttribute('name', '0');
    el.setAttribute(`l-text`, '1');
    el.setAttribute(`:input`, '2');
    const propsOut = props(el);
    // @ts-ignore
    propsOut.directives.text.compute = compute;
    // @ts-ignore
    propsOut.directives['bind:input'].compute = compute;

    expect(propsOut).toEqual({
      attributes: { name: '0' },
      directives: { text: { value: '1', compute }, 'bind:input': { value: '2', compute } },
    });
  });

  it('should not generate anything if no attributes', () => {
    const el = document.createElement('div');
    const propsOut = props(el);

    expect(propsOut).toEqual({
      attributes: {},
      directives: {},
    });
  });
});
