import { expressionPropRE, rawDirectiveSplitRE, hasDirectiveRE } from '../patterns';

describe('.patterns', () => {
  it('should test as true with this', () => {
    expect(expressionPropRE('1').test('this.1')).toBe(true);
  });
  it('should false as true with this', () => {
    expect(expressionPropRE('11').test('this.1')).toBe(false);
  });
  it('should test as true without this', () => {
    expect(expressionPropRE('1', false).test('1')).toBe(true);
  });
  it('should test as false without this', () => {
    expect(expressionPropRE('11', false).test('1')).toBe(false);
  });
  it('should not break directive split', () => {
    expect(rawDirectiveSplitRE()).toStrictEqual(/:|\./);
  });
  it('should have working directive pattern', () => {
    expect(hasDirectiveRE()).toStrictEqual(/(l-|@|:)\w+/gim);
  });
});
