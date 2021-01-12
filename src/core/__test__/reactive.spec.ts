import { reactive, handlePatch } from '../reactive';
import patch from '../patch';

describe('.reactive', () => {
  it('should create an observed proxy', () => {
    const objectState = { foo: 'bar', deepTest: { deepChild: 'bar' } };
    const state = reactive({ foo: 'bar', deepTest: { deepChild: 'bar' } }, patch);

    expect({ ...state }).toEqual(objectState);
  });

  it('should react if changed', () => {
    let count = 0;
    const state = reactive({ foo: 'bar' }, () => ++count);

    state.foo = 'baz';
    delete state.foo;

    expect(count).toEqual(2);
  });

  it('should handle array and return boolean', () => {
    expect(handlePatch({}, 'length', {}, () => {})).toEqual(true);
    expect(handlePatch({}, 'foo', {}, () => {})).toEqual(false);
  });

  it('should react if array is changed', () => {
    let count = 0;
    const state = reactive({ foo: [] }, () => ++count);

    // @ts-ignore
    state.foo.push('bar');
    delete state.foo;

    expect(count).toEqual(3);
  });

  it('should find arrays with deps through direct mutation', () => {
    const mockCb = jest.fn();
    const state = reactive({ foo: ['bar', 'bar', 'bar'], boo: '' }, mockCb);

    const el1 = document.createElement('ul');
    const el2 = document.createElement('li');
    el1.setAttribute('l-for', 'item in this.foo');
    el2.setAttribute('l-text', 'this.item + this.boo');
    el1.appendChild(el2);
    document.body.appendChild(el1);
    // @ts-ignore
    el1.__l = {};
    // @ts-ignore
    el1.__l.state = state;

    // @ts-ignore
    state.foo[1] = 'baz';
    state.boo = 'boo';

    const keys = mockCb.mock.calls[1][0];
    expect(mockCb).toBeCalledTimes(2);
    expect(keys).toEqual(['boo', 'foo']);
  });
});
