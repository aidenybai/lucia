import { fireEvent } from '@testing-library/dom';

import { modelDirective } from '../model';
import compute from '../../utils/compute';

describe('.modelDirective', () => {
  it('should attach and model input', () => {
    const el = document.createElement('input');
    const expression = 'this.foo';
    const state = {
      foo: 'bar',
    };
    modelDirective(
      {
        el,
        name: 'l-model',
        data: { value: expression, compute: compute(expression, { $el: el }) },
        app: { state },
      },
      true
    );
    expect(typeof el.oninput).toEqual('function');
    el.value = 'baz';
    fireEvent.input(el);
    setTimeout(() => {
      // @ts-ignore
      expect(el.__l_model_state).toEqual({ foo: 'baz' });
    }, 0);
  });

  it('should parse number value', () => {
    const el = document.createElement('input');
    const expression = 'this.foo';
    const state = {
      foo: 'bar',
    };
    modelDirective(
      {
        el,
        name: 'l-model',
        data: { value: expression, compute: compute(expression, { $el: el }) },
        app: { state },
      },
      true
    );
    el.value = '0';
    fireEvent.input(el);
    setTimeout(() => {
      // @ts-ignore
      expect(el.__l_model_payload).toEqual(`Number('0').toPrecision()`);
    }, 0);
  });

  it('should parse boolean value', () => {
    const el = document.createElement('input');
    const expression = 'this.foo';
    const state = {
      foo: 'bar',
    };
    modelDirective(
      {
        el,
        name: 'l-model',
        data: { value: expression, compute: compute(expression, { $el: el }) },
        app: { state },
      },
      true
    );
    el.value = 'true';
    fireEvent.input(el);
    setTimeout(() => {
      // @ts-ignore
      expect(el.__l_model_payload).toEqual(`Boolean('true')`);
    }, 0);
  });

  it('should parse undefined value', () => {
    const el = document.createElement('input');
    const expression = 'this.foo';
    const state = {
      foo: 'bar',
    };
    modelDirective(
      {
        el,
        name: 'l-model',
        data: { value: expression, compute: compute(expression, { $el: el }) },
        app: { state },
      },
      true
    );
    el.value = 'null';
    fireEvent.input(el);
    setTimeout(() => {
      // @ts-ignore
      expect(el.__l_model_payload).toEqual(null);
    }, 0);
  });

  it('should parse null value', () => {
    const el = document.createElement('input');
    const expression = 'this.foo';
    const state = {
      foo: 'bar',
    };
    modelDirective(
      {
        el,
        name: 'l-model',
        data: { value: expression, compute: compute(expression, { $el: el }) },
        app: { state },
      },
      true
    );
    el.value = 'undefined';
    fireEvent.input(el);
    setTimeout(() => {
      // @ts-ignore
      expect(el.__l_model_payload).toEqual(undefined);
    }, 0);
  });
});
