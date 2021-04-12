export const removeDupesFromArray = (array: string[]): string[] => {
  return [...new Set(array)];
};

export default removeDupesFromArray;
