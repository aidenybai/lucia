import { observer, handleArray } from '../observer';
import patch from '../patch';

describe('.observer', () => {
  it('should create an observed proxy', () => {
    const objectView = { test: 1, deepTest: { deepChild: 2 } };
    const view = observer({ test: 1, deepTest: { deepChild: 2 } }, patch);

    expect({ ...view }).toEqual(objectView);
  });
  it('should react if changed', () => {
    const mockCb = jest.fn();
    const view = observer({ test: 1 }, mockCb);

    view.test = 2;
    delete view.test;

    expect(mockCb.mock.calls[0]);
    expect(mockCb.mock.calls[1]);
  });
  it('should handle array and return boolean', () => {
    expect(handleArray({}, 'length', {}, () => {})).toEqual(true);
    expect(handleArray({}, 'foo', {}, () => {})).toEqual(false);
  });
});
