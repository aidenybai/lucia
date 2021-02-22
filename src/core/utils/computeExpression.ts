import { UnknownKV } from '../../models/generics';
export const computeExpression = (
  expression: string,
  el?: HTMLElement,
  returnable?: boolean
): Function => {
  let formattedExpression = `with($state){${
    returnable ?? true ? `return ${expression}` : expression
  }}`;
  return (state: UnknownKV, event?: Event) => {
    try {
      const value = state[expression];
      if (value) {
        // @ts-expect-error
        typeof value === 'function' ? state[expression]() : value;
      } else {
        const emit = (name: string, options?: CustomEventInit, dispatchGlobal: boolean = true) => {
          const event = new CustomEvent(name, options);
          (dispatchGlobal ? document : el || document).dispatchEvent(event);
        };

        return new Function('$state', '$el', '$emit', '$event', formattedExpression)(
          state,
          el,
          emit,
          event
        );
      }
    } catch (err) {
      console.warn(`Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`, el);
    }
  };
};

export default computeExpression;
