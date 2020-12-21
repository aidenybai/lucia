import { fireEvent } from '@testing-library/dom';

import { modelDirective } from '../model';
import compute from '../../utils/compute';

describe('.modelDirective', () => {
  it('should attach and model input', () => {
    const fakeElem = document.createElement('input');
    const mockCb = jest.fn();
    const expression = 'this.mockCb';
    const state = {
      mockCb,
    };
    modelDirective({
      el: fakeElem,
      name: 'l-model',
      data: { value: expression, compute: compute(expression, { $el: fakeElem }) },
      app: { state },
    });
    expect(typeof fakeElem.oninput).toBe('function');
    fireEvent.input(fakeElem);
    expect(mockCb.mock.calls[0]);
  });
});
