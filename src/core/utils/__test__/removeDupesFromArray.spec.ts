import removeDupesFromArray from '../removeDupesFromArray';

describe('.removeDupesFromArray', () => {
  it('should remove duplicates from array', () => {
    const array = ['foo', 'foo', 'bar', 'bar', 'baz', 'baz'];
    expect(removeDupesFromArray(array)).toEqual(['foo', 'bar', 'baz']);
    expect(typeof removeDupesFromArray(array)).toEqual('object');
  });

  it('should not remove anything from the array', () => {
    const array = ['foo', 'bar', 'baz'];
    expect(removeDupesFromArray(array)).toEqual(['foo', 'bar', 'baz']);
  });
});
