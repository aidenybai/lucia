import { fireEvent } from '@testing-library/dom';

import { onDirective } from '../on';
import compute from '../../utils/computeExpression';

describe('.onDirective', () => {
  it('should attach onclick', () => {
    const el = document.createElement('button');
    const mockCb = jest.fn();
    const expression = 'mockCb()';
    const state = {
      mockCb,
    };
    onDirective({
      el,
      name: 'l-on:click',
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });
    // @ts-ignore
    expect(typeof el.__l_on_registered).toEqual('boolean');
    fireEvent.click(el);
    expect(mockCb).toBeCalled();
  });
});
