import { StringKV } from '../../models/generics';
import { reactive } from '../reactive';

describe('.reactive', () => {
  it('should create a revocable proxy', () => {
    const state = { foo: null };
    const callback = jest.fn();
    const revocableProxy = reactive(state, callback);

    expect(typeof revocableProxy.proxy).toEqual('object');
    expect(typeof revocableProxy.revoke).toEqual('function');
  });

  it('should run the callback function on mutation', () => {
    const state = { foo: null };
    const callback = jest.fn();
    const revocableProxy = reactive(state, callback);

    revocableProxy.proxy.foo = 'baz';

    expect(callback).toBeCalledTimes(1);
    expect(revocableProxy.proxy.foo).toEqual('baz');

    for (let i = 0; i < 3; i++) {
      revocableProxy.proxy.foo = i;
    }

    expect(callback).toBeCalledTimes(4);
    expect(revocableProxy.proxy.foo).toEqual(2);
  });

  it('should seal object', () => {
    const state = { foo: 'baz' };
    const callback = jest.fn();
    const revocableProxy = reactive(state, callback);

    expect(() => {
      revocableProxy.proxy.bar = 'baz';
    }).toThrowError();

    expect(Object.keys(revocableProxy.proxy).length).toEqual(2);

    expect(() => {
      delete revocableProxy.proxy.foo;
    }).toThrowError();

    expect(Object.keys(revocableProxy.proxy).length).toEqual(2);
  });

  it('should not allow function mutation', () => {
    const state = {
      foo: () => 0,
    };
    const callback = jest.fn();
    const revocableProxy = reactive(state, callback);

    expect(() => {
      (revocableProxy.proxy.foo as Function) = () => 1;
    }).toThrowError();

    expect((revocableProxy.proxy.foo as Function)()).toEqual(0);
  });

  it('should find and pass array key', () => {
    const state = { foo: [] };
    let result = null;
    const callback = (deps: string[]) => (result = deps[0]);
    const revocableProxy = reactive(state, callback);

    (revocableProxy.proxy.foo as string[]).push('baz');

    expect(result).toEqual('foo');
  });

  it('should handle nested proxies', () => {
    const state = { foo: { bar: 'baz' } };
    let result = null;
    const callback = (deps: string[]) => (result = deps[0]);
    const revocableProxy = reactive(state, callback);

    (revocableProxy.proxy.foo as StringKV).bar = '1';

    expect(result).toEqual('foo');
  });
});
