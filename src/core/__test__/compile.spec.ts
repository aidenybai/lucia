import {
  compile,
  createASTNode,
  isListRenderScope,
  isUnderListRenderScope,
  flattenNodeChildren,
} from '../compile';
import compute from '../../core/utils/computeExpression';

describe('.compile', () => {
  it('should not return anything', () => {
    const rootEl = document.createElement('div');

    const state = { foo: 'bar' };
    const ast = compile(rootEl, state, true);

    expect(ast).toEqual([]);
  });

  it('should compile an AST tree', () => {
    const rootEl = document.createElement('div');
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    const el3 = document.createElement('div');

    el1.setAttribute('l-text', `foo`);
    el2.setAttribute('l-text', `foo`);
    el3.setAttribute('l-text', `foo`);

    rootEl.appendChild(el1);
    el1.appendChild(el2);
    el2.appendChild(el3);

    const state = { foo: 'bar' };
    const ast = compile(rootEl, state);

    expect(JSON.stringify(ast)).toEqual(
      JSON.stringify([
        createASTNode(el1, state),
        createASTNode(el2, state),
        createASTNode(el3, state),
      ])
    );
  });

  it('should properly create AST node', () => {
    const el = document.createElement('div');
    const state = { foo: 'bar' };
    el.setAttribute('l-text', 'foo');
    const ast = compile(el, state);
    const data = { compute: compute('foo', el), deps: ['foo'], value: 'foo' };

    expect(JSON.stringify(ast)).toEqual(
      JSON.stringify([
        {
          el,
          deps: ['foo'],
          directives: { text: data },
          type: 1,
        },
      ])
    );
  });

  it('should handle inline and ignore nested components', (done) => {
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    const state = { foo: 'bar' };

    el1.setAttribute('l-state', JSON.stringify(state));
    el1.setAttribute('l-html', 'foo');
    el2.setAttribute('l-state', '{}');
    el1.appendChild(el2);

    setTimeout(() => {
      expect(JSON.stringify(compile(el1, state))).toEqual(
        JSON.stringify([createASTNode(el1, state)])
      );
      const referenceEl2ASTNode = createASTNode(el2, {});
      expect(JSON.stringify(compile(el2, {}))).toEqual(
        JSON.stringify(referenceEl2ASTNode ? [referenceEl2ASTNode] : [])
      );
      done();
    }, 0);
  });

  it('should detect list render scope', () => {
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');

    expect(isListRenderScope(el1)).toEqual(false);
    expect(isUnderListRenderScope(el2)).toEqual(false);

    el1.setAttribute('l-for', 'foo');
    el1.appendChild(el2);

    expect(isListRenderScope(el1)).toEqual(true);
    expect(isUnderListRenderScope(el2)).toEqual(true);
  });

  it('should extract node children as collection', (done) => {
    const layer1El = document.createElement('div');
    const layer2El = document.createElement('div');
    const layer3El = document.createElement('div');
    const layer4El = document.createElement('div');

    const forLoopEl = document.createElement('div');
    const forLoopChild1 = document.createElement('div');
    const forLoopChild2 = document.createElement('div');
    const forLoopChild3 = document.createElement('div');

    layer1El.setAttribute('l-state', '{}');
    forLoopEl.setAttribute('l-for', 'foo');

    layer3El.appendChild(layer4El);
    layer2El.appendChild(layer3El);
    layer1El.appendChild(layer2El);

    forLoopEl.appendChild(forLoopChild1);
    forLoopEl.appendChild(forLoopChild2);
    forLoopEl.appendChild(forLoopChild3);

    layer1El.appendChild(forLoopEl);

    setTimeout(() => {
      const normalCollection = flattenNodeChildren(layer1El);
      const compiledNormalCollection = compile(layer1El, {});
      const listCollection = flattenNodeChildren(forLoopEl, false);
      const listCollectionAsListGroup = flattenNodeChildren(forLoopEl, true);

      expect(compiledNormalCollection.length).toEqual(1);
      expect(listCollection).toEqual([]);
      expect(listCollectionAsListGroup).toEqual([forLoopChild1, forLoopChild2, forLoopChild3]);
      expect(normalCollection).toEqual([layer1El, layer2El, layer3El, layer4El, forLoopEl]);
      done();
    }, 0);
  });
});
