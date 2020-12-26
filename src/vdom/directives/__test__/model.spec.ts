import { fireEvent } from '@testing-library/dom';

import { modelDirective, inputCallback } from '../model';
import compute from '../../utils/compute';

describe('.modelDirective', () => {
  it('should attach and model input', () => {
    const el = document.createElement('input');
    const expression = 'this.foo';
    const state = {
      foo: 'bar',
    };
    modelDirective({
      el,
      name: 'l-model',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(typeof el.oninput).toEqual('function');
    el.value = 'baz';
    fireEvent.input(el);
  });

  it('should parse number value', () => {
    const el = document.createElement('input');
    const expression = 'this.foo';
    const state = {
      foo: 'bar',
    };
    el.value = '0';
    const payload = inputCallback(
      el,
      0,
      { value: expression, compute: compute(expression, { $el: el }) },
      { state }
    );
    expect(payload).toEqual(`Number('0').toPrecision()`);
  });

  it('should parse boolean value', () => {
    const el = document.createElement('input');
    const expression = 'this.foo';
    const state = {
      foo: 'bar',
    };
    el.value = 'true';
    const payload = inputCallback(
      el,
      true,
      { value: expression, compute: compute(expression, { $el: el }) },
      { state }
    );
    expect(payload).toEqual(`Boolean('true')`);
  });

  it('should parse null value', () => {
    const el = document.createElement('input');
    const expression = 'this.foo';
    const state = {
      foo: 'bar',
    };
    el.value = 'null';
    const payload = inputCallback(
      el,
      null,
      { value: expression, compute: compute(expression, { $el: el }) },
      { state }
    );
    expect(payload).toEqual(null);
  });

  it('should parse undefined value', () => {
    const el = document.createElement('input');
    const expression = 'this.foo';
    const state = {
      foo: 'bar',
    };
    el.value = 'undefined';
    const payload = inputCallback(
      el,
      undefined,
      { value: expression, compute: compute(expression, { $el: el }) },
      { state }
    );
    expect(payload).toEqual(undefined);
  });
});
