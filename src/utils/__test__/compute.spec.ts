import compute from '../compute';

describe('.compute', () => {
  it('should compute correctly', () => {
    expect(compute('count + 1', { $view: { count: 0 } })).toBe(1);
  });
});
