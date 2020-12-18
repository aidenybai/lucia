import { fireEvent } from '@testing-library/dom';

import { onDirective } from '../on';
import compute from '../../utils/compute';

describe('.onDirective', () => {
  it('should attach onclick', () => {
    const fakeElem = document.createElement('button');
    const mockCb = jest.fn();
    const expression = 'this.mockCb';
    const state = {
      mockCb,
    };
    onDirective({
      el: fakeElem,
      name: 'l-on:click',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      state,
    });
    expect(typeof fakeElem.onclick).toBe('function');
    fireEvent.click(fakeElem);
    expect(mockCb.mock.calls[0]);
  });
});
