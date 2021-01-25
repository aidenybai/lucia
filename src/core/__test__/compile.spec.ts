import {
  compile,
  createASTNode,
  isListRenderScope,
  isUnderListRenderScope,
  extractNodeChildrenAsCollection,
} from '../compile';
import compute from '../../core/utils/computeExpression';

describe('.compile', () => {
  it('should throw an error', () => {
    // @ts-ignore
    expect(() => compile()).toThrowError(new Error('Please provide a Element'));
  });

  it('should compile an AST tree', () => {
    const rootEl = document.createElement('div');
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    const el3 = document.createElement('div');

    el1.setAttribute('l-text', `bar`);
    el2.setAttribute('l-text', `bar`);
    el3.setAttribute('l-text', `bar`);

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

  it('should extract node children as collection', () => {
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
      const normalCollection = extractNodeChildrenAsCollection(layer1El);
      const compiledNormalCollection = compile(layer1El, {});
      const listCollection = extractNodeChildrenAsCollection(forLoopEl, false);
      const listCollectionAsListGroup = extractNodeChildrenAsCollection(forLoopEl, true);

      expect(compiledNormalCollection.length).toEqual(1);
      expect(listCollection).toEqual([forLoopEl]);
      expect(listCollectionAsListGroup).toEqual([
        forLoopEl,
        forLoopChild1,
        forLoopChild2,
        forLoopChild3,
      ]);
      expect(normalCollection).toEqual([
        layer1El,
        layer2El,
        layer3El,
        layer4El,
        forLoopEl,
        forLoopChild1,
        forLoopChild2,
        forLoopChild3,
      ]);
    }, 0);
  });
});
