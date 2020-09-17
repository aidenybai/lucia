import DeepProxy from './deepProxy';

export const observer = (
  data: any | Function,
  patch: Function,
  vdom: Record<string, any> | null
): Record<any, any> => {
  const proxy = new DeepProxy(data, {
    set(): void {
      patch(vdom, data);
    },
    deleteProperty(): void {
      patch(vdom, data);
    },
  });

  return proxy.init();
};

export default observer;
