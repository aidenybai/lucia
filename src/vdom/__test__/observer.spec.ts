import { observer, handleArray } from '../observer';
import patch from '../patch';

describe('.observer', () => {
  it('should create an observed proxy', () => {
    const view = observer({ test: 1, deepTest: { deepChild: 2 } }, patch);

    expect({ ...view }).toEqual({
      ...new Proxy(
        { test: 1, deepTest: { deepChild: 2 } },
        {
          get(target: Record<string, unknown>, key: string): unknown {
            return target[key];
          },
          set(target: Record<string, unknown>, key: string, value: unknown): boolean {
            target[key] = value;
            return true;
          },
          deleteProperty(target: Record<string, unknown>, key: string): boolean {
            delete target[key];
            return true;
          },
        }
      ),
    });
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
