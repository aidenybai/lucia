// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import rewriteWithNewDeps from '../rewriteWithNewDeps';

describe('.rewriteWithNewDeps', () => {
  it('should adjust dependencies', () => {
    const node = {
      deps: ['foo', 'bar'],
      directives: { foo: { deps: [] } },
    };
    // @ts-expect-error: node cannot be passed this way, but we are faking an AST
    rewriteWithNewDeps([node], ['baz'], node, 'foo');

    expect(node.deps).toEqual(['baz', 'foo', 'bar']);
    expect(node.directives.foo.deps).toEqual(['baz', 'foo', 'bar']);
  });
});
