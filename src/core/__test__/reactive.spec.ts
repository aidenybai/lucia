import { KV } from '../../models/generics';
import { reactive } from '../reactive';

describe('.reactive', () => {
  it('should create a proxy', () => {
    const state = { foo: null };
    const callback = jest.fn();
    const proxy = reactive(state, callback);

    expect(typeof proxy).toEqual('object');
  });

  it('should run the callback function on mutation', () => {
    const state = { foo: null };
    const callback = jest.fn();
    const proxy = reactive(state, callback);

    proxy.foo = 'baz';

    expect(callback).toBeCalledTimes(1);
    expect(proxy.foo).toEqual('baz');

    for (let i = 0; i < 3; ++i) {
      proxy.foo = i;
    }

    expect(callback).toBeCalledTimes(4);
    expect(proxy.foo).toEqual(2);
  });

  it('should seal object', () => {
    const state = { foo: 'baz' };
    const callback = jest.fn();
    const proxy = reactive(state, callback);

    expect(() => {
      proxy.bar = 'baz';
    }).toThrowError();

    expect(Object.keys(proxy).length).toEqual(1);

    expect(() => {
      delete proxy.foo;
    }).toThrowError();

    expect(Object.keys(proxy).length).toEqual(1);
  });

  it('should find and pass array key', () => {
    const state = { foo: [] };
    let result = null;
    const callback = (deps: string[]) => (result = deps[0]);
    const proxy = reactive(state, callback);

    (proxy.foo as string[]).push('baz');

    expect(result).toEqual('foo');
  });

  it('should handle nested proxies', () => {
    const state = { foo: { bar: 'baz' } };
    let result = null;
    const callback = (deps: string[]) => (result = deps[0]);
    const proxy = reactive(state, callback);

    (proxy.foo as KV<string>).bar = '1';

    expect(result).toEqual('bar');
  });

  it('should break on unsupported type', () => {
    const foo = new Map();
    const state = { foo };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const proxy = reactive(state, () => {});

    expect(proxy.foo).toEqual(foo);
  });
});
