import { fireEvent } from '@testing-library/dom';
import compute from '../../utils/computeExpression';
import { onDirective } from '../on';

describe('.onDirective', () => {
  it('should attach click event listener', () => {
    const el = document.createElement('button');
    const callback = jest.fn();
    const expression = 'callback';
    const state = {
      callback,
    };
    onDirective({
      el,
      parts: ['on', 'click'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });

    fireEvent.click(el);
    const CLICK_REGISTERED_FLAG = '__on_click_registered';
    expect(typeof el[CLICK_REGISTERED_FLAG]).toEqual('boolean');
    expect(callback).toBeCalledTimes(1);

    onDirective({
      el,
      parts: ['on', 'click'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });

    expect(callback).toBeCalledTimes(1);
  });
});
