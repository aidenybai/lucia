import { fireEvent } from '@testing-library/dom';

import { onDirective } from '../on';
import compute from '../../utils/computeExpression';
import { getElementCustomProp } from '../../utils/elementCustomProp';

describe('.onDirective', () => {
  it('should attach click event listener', () => {
    const el = document.createElement('button');
    const callback = jest.fn();
    const expression = 'callback()';
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
    expect(typeof getElementCustomProp(el, '__on_click_registered')).toEqual('boolean');
    expect(callback).toBeCalledTimes(1);

    onDirective({
      el,
      parts: ['on', 'click'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });

    expect(callback).toBeCalledTimes(1);
  });

  it('should work with global event listener', () => {
    document.body.innerHTML = '';

    const event = new CustomEvent('customEvent');

    const el = document.createElement('button');
    const callback = jest.fn();
    const expression = 'callback()';
    const state = {
      callback,
    };
    document.body.appendChild(el);

    onDirective({
      el,
      parts: ['on', 'customEvent', 'global'],
      data: { value: expression, compute: compute(expression, el), deps: [] },
      state,
    });

    el.dispatchEvent(event);
    // @ts-expect-error
    expect(typeof el.__on_customEvent_registered).toEqual('boolean');
    expect(callback).toBeCalledTimes(0);

    window.dispatchEvent(event);
    expect(callback).toBeCalledTimes(1);
  });
});
