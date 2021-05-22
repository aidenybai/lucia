// Lazy allows us to delay render calls if the main thread is blocked
// This is kind of like time slicing in React but less advanced
/* istanbul ignore file */

export const lazy = (
  threshold: number,
  generatorFunction: () => Generator<undefined, void, unknown>,
): (() => void) => {
  const generator = generatorFunction();
  return function next() {
    const start = performance.now();
    let task = null;
    do {
      task = generator.next();
    } while (performance.now() - start < threshold && !task.done);

    if (task.done) return;
    setTimeout(next);
  };
};

export default lazy;
