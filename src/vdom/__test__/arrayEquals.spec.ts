import arrayEquals from '../../utils/arrayEquals';

describe('.arrayEquals', () => {
  it('should return true', () => {
    expect(arrayEquals([1, 2, 'foo'], [1, 2, 'foo'])).toBe(true);
  });
});
