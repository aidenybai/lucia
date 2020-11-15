import getSelector from '../selector';

describe('.getSelector', () => {
  it('should get correct selector for body', () => {
    expect(getSelector(document.body)).toBe('html > body');
  });
});
