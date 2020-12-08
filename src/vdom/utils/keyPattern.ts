export const keyPattern = (key: string, hasThis: boolean = true) => {
  return new RegExp(`${hasThis ? 'this\\.' : ''}${key}\\b`);
};

export default keyPattern;
