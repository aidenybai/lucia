import concurrent from '../concurrent';

describe('.concurrent', () => {
  it('should return a generator function', () => {
    expect(typeof concurrent).toEqual('function');
    expect(
      // @ts-expect-error: generator function type acceptable
      typeof concurrent(function* () {
        yield 'foo';
      })
    ).toEqual('function');
  });
});
