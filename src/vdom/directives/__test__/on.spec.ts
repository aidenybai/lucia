import { fireEvent } from '@testing-library/dom';

import { onDirective } from '../on';
import compute from '../../utils/compute';

describe('.onDirective', () => {
  it('should attach onclick', () => {
    const el = document.createElement('button');
    const mockCb = jest.fn();
    const expression = 'this.mockCb()';
    const state = {
      mockCb,
    };
    onDirective({
      el,
      name: 'l-on:click',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(typeof el.onclick).toBe('function');
    fireEvent.click(el);
    expect(mockCb).toBeCalled();
  });
});
