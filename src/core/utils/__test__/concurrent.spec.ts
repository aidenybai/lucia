import concurrent from '../concurrent';

describe('.concurrent', () => {
  it('should return a generator function', () => {
    expect(typeof concurrent).toEqual('function');
    expect(typeof concurrent(function*() {})).toEqual('function');
  });
});
