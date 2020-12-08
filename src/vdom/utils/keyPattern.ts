export const keyPattern = (key: string, hasThis: boolean = true) => {
  // Utilizes \b (word boundary) for key differentiation.
  // Fails when next character is a \w (Word).
  return new RegExp(`${hasThis ? 'this\\.' : ''}${key}\\b`);
};

export default keyPattern;
