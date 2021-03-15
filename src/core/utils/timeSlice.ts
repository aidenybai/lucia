export function timeSlice(gen: () => Generator<undefined, void, unknown>) {
  const generator = gen();
  return function next() {
    const start = performance.now();
    let res = null;
    do {
      res = generator.next();
    } while (!res.done && performance.now() - start < 10);

    if (res.done) return;
    setTimeout(next);
  };
}

export default timeSlice;
