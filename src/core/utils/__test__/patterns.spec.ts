import {
  expressionPropRE,
  rawDirectiveSplitRE,
  hasDirectiveRE,
  eventDirectivePrefixRE,
  parenthesisWrapReplaceRE,
} from '../patterns';

describe('.patterns', () => {
  it('should test as true', () => {
    expect(expressionPropRE('1').test('1')).toEqual(true);
  });

  it('should false as true', () => {
    expect(expressionPropRE('11').test('1')).toEqual(false);
  });

  it('should not break directive split', () => {
    expect(rawDirectiveSplitRE()).toStrictEqual(/:|\./gim);
  });

  it('should have working directive pattern', () => {
    expect(hasDirectiveRE()).toStrictEqual(/(l-|@|:)\w+/gim);
  });

  it('should have valid event directive prefix', () => {
    expect(eventDirectivePrefixRE()).toStrictEqual(/on|@/gim);
  });

  it('should replace parenthesis', () => {
    expect('(test)'.replace(parenthesisWrapReplaceRE(), '')).toEqual('test');
  });
});
