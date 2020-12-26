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
});
