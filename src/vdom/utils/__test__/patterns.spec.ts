import { keyPattern, rawDirectiveSplitPattern } from '../patterns';

describe('.patterns', () => {
  it('should test as true with this', () => {
    expect(keyPattern('1').test('this.1')).toBe(true);
  });
  it('should false as true with this', () => {
    expect(keyPattern('11').test('this.1')).toBe(false);
  });
  it('should test as true without this', () => {
    expect(keyPattern('1', false).test('1')).toBe(true);
  });
  it('should test as false without this', () => {
    expect(keyPattern('11', false).test('1')).toBe(false);
  });
  it('should not break directive split', () => {
    expect(rawDirectiveSplitPattern).toStrictEqual(/:|\./);
  });
});
