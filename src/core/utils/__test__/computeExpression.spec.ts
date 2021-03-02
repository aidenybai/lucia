import { computeExpression } from '../computeExpression';

describe('.compute', () => {
  it('should use key-based retrieval during computation', () => {
    const el = document.createElement('div');

    expect(computeExpression('count', el)({ count: 0 })).toEqual(0);
  });

  it('should compute correctly', () => {
    const el = document.createElement('div');
    expect(computeExpression('count + 1', el)({ count: 0 })).toEqual(1);
  });

  it('should not return the value', () => {
    const el = document.createElement('div');
    expect(computeExpression('count + 1', el, false)({ count: 0 })).toEqual(undefined);
  });

  it('should emit and access an event', () => {
    const el = document.createElement('div');

    expect(
      // @ts-expect-error
      computeExpression(`$emit('customEvent', $el); return $event`, el, false)({}, 'foo')
    ).toEqual('foo');
  });
});
