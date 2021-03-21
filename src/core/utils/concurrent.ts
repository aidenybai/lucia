export const concurrent = (generatorFunction: () => Generator<undefined, void, unknown>) => {
  const generator = generatorFunction();
  return function next() {
    const start = performance.now();
    let task = null;
    do {
      task = generator.next();
    } while (performance.now() - start < 25 && !task.done);

    if (task.done) return;
    setTimeout(next);
  };
};

export default concurrent;
