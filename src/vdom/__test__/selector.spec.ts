import selector from '../helpers/selector';

describe('.selector', () => {
  it('should get correct selector for body', () => {
    expect(selector(document.body)).toBe('html > body');
  });
});
