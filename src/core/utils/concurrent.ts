/* istanbul ignore file */

// Concurrent allows us to delay render calls if the main thread is blocked
// This is kind of like time slicing in React but less advanced

export const concurrent = (
  threshold: number,
  generatorFunction: () => Generator<undefined, void, unknown>
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function => {
  const generator = generatorFunction();
  return function next() {
    const start = performance.now();
    let task = null;
    do {
      task = generator.next();
    } while (performance.now() - start < threshold && !task.done);

    if (task.done) return;
    /* istanbul ignore next */
    setTimeout(next);
  };
};

export default concurrent;
