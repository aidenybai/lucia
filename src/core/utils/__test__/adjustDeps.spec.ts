import adjustDeps from '../adjustDeps';

describe('.adjustDeps', () => {
  it('should adjust dependencies', () => {
    const node = {
      deps: ['foo', 'bar'],
      directives: { foo: { deps: [] } },
    };
    // @ts-expect-error: node cannot be passed this way, but we are faking an AST
    adjustDeps([node], ['baz'], node, 'foo');

    expect(node.deps).toEqual(['baz', 'foo', 'bar']);
    expect(node.directives.foo.deps).toEqual(['baz', 'foo', 'bar']);
  });
});
