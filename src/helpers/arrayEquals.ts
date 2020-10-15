const arrayEquals = (first: unknown[], second: unknown[]) => {
  return (
    first instanceof Array &&
    second instanceof Array &&
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
};

export default arrayEquals;
