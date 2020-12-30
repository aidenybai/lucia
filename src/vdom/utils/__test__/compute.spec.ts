import compute from '../compute';

describe('.compute', () => {
  it('should compute correctly', () => {
    expect(compute('this.count + 1', {})({ count: 0 })).toEqual(1);
  });

  it('should not return the value', () => {
    expect(compute('this.count + 1', {}, false)({ count: 0 })).toEqual(undefined);
  });
});
