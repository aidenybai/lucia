import { reactive, handleArray } from '../reactive';
import patch from '../patch';

describe('.reactive', () => {
  it('should create an observed proxy', () => {
    const objectState = { test: 1, deepTest: { deepChild: 2 } };
    const state = reactive({ test: 1, deepTest: { deepChild: 2 } }, patch);

    expect({ ...state }).toEqual(objectState);
  });
  it('should react if changed', () => {
    const mockCb = jest.fn();
    const state = reactive({ test: 1 }, mockCb);

    state.test = 2;
    delete state.test;

    expect(mockCb.mock.calls[0]);
    expect(mockCb.mock.calls[1]);
  });
  it('should handle array and return boolean', () => {
    expect(handleArray({}, 'length', {}, () => {})).toEqual(true);
    expect(handleArray({}, 'foo', {}, () => {})).toEqual(false);
  });
});
