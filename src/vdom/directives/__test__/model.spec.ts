import { fireEvent } from '@testing-library/dom';

import { modelDirective } from '../model';

describe('.modelDirective', () => {
  it('should attach and model input', () => {
    const fakeElem = document.createElement('input');
    const mockCb = jest.fn();
    modelDirective({
      el: fakeElem,
      name: 'l-model',
      value: 'this.mockCb',
      state: {
        mockCb,
      },
    });
    expect(typeof fakeElem.oninput).toBe('function');
    fireEvent.input(fakeElem);
    expect(mockCb.mock.calls[0]);
  });
});
