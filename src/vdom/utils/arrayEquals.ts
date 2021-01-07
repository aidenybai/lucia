const arrayEquals = (firstArray: unknown[], secondArray: unknown[]) => {
  // adapted from stackoverflow: https://stackoverflow.com/a/16436975/14949493
  if (firstArray === secondArray) return true;
  if (firstArray == null || secondArray == null) return false;
  if (firstArray.length !== secondArray.length) return false;

  for (var i = 0; i < firstArray.length; ++i) {
    if (firstArray[i] !== secondArray[i]) return false;
  }

  return true;
};

export default arrayEquals;
