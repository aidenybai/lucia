/* istanbul ignore file */

// Fiber allows us to delay render calls if the main thread is blocked
// This is kind of like time slicing in React but less advanced

export const fiber = (
  generatorFunction: () => Generator<undefined, void, unknown>
  // eslint-disable-next-line @typescript-eslint/ban-types
): IdleRequestCallback => {
  const generator = generatorFunction();
  return function next(deadline: IdleDeadline) {
    let task = null;
    do {
      task = generator.next();
    } while (!task.done && deadline.timeRemaining() > 0);

    if (task.done) return;
    /* istanbul ignore next */
    requestIdleCallback(next);
  };
};

export default fiber;
