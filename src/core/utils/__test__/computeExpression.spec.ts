import { computeExpression } from '../computeExpression';

describe('.compute', () => {
  it('should use key-based retrieval during computation', () => {
    const el = document.createElement('div');

    expect(computeExpression('count', el, true, {}, ['count'])({ count: 0 })).toEqual(0);
  });

  it('should compute correctly', () => {
    const el = document.createElement('div');
    expect(computeExpression('count + 1', el, true, {}, ['count'])({ count: 0 })).toEqual(1);
  });

  it('should not return the value', () => {
    const el = document.createElement('div');
    expect(computeExpression('count + 1', el, false, {}, ['count'])({ count: 0 })).toEqual(undefined);
  });

  it('should emit and access an event', () => {
    const el = document.createElement('div');

    expect(
      // @ts-expect-error: 'foo' cannot be passed as an Event, but good enough for our use case
      computeExpression(`$emit('customEvent', $el); return $event`, el, false, {}, [])({}, 'foo')
    ).toEqual('foo');
  });
});
