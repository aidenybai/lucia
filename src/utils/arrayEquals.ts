const arrayEquals = (firstArray: unknown[], secondArray: unknown[]) => {
  // Deep Array equality check
  return (
    firstArray instanceof Array &&
    secondArray instanceof Array &&
    firstArray.length === secondArray.length &&
    firstArray.every((value: unknown, i: number) => value === secondArray[i])
  );
};

export default arrayEquals;
