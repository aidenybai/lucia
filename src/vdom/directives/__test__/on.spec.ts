import { fireEvent } from '@testing-library/dom';

import { onDirective } from '../on';

describe('.onDirective', () => {
  it('should attach onclick', () => {
    const fakeElem = document.createElement('button');
    const mockCb = jest.fn();
    onDirective({
      el: fakeElem,
      name: 'l-on:click',
      value: 'this.mockCb',
      state: {
        mockCb,
      },
    });
    expect(typeof fakeElem.onclick).toBe('function');
    fireEvent.click(fakeElem);
    expect(mockCb.mock.calls[0]);
  });
});
