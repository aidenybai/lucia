export const removeDupesFromArray = (array: any[]): any[] => {
  return [...new Set(array)];
};

export default removeDupesFromArray;
