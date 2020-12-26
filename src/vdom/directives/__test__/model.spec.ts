import { fireEvent } from '@testing-library/dom';

import { modelDirective } from '../model';
import compute from '../../utils/compute';

describe('.modelDirective', () => {
  it('should attach and model input', () => {
    const el = document.createElement('input');
    const mockCb = jest.fn();
    const expression = 'this.mockCb';
    const state = {
      mockCb,
    };
    modelDirective({
      el: el,
      name: 'l-model',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(typeof el.oninput).toBe('function');
    fireEvent.input(el);
    expect(mockCb.mock.calls[0]);
  });
});
