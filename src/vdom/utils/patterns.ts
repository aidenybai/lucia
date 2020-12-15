export const rawDirectiveSplitPattern = /:|\./;
export const selectorSplitPattern = /(?=\.)|(?=#)|(?=\[)/;
export const keyPattern = (key: string, hasThis: boolean = true): RegExp => {
  // Utilizes \b (word boundary) for key differentiation.
  // Fails when next character is a \w (Word).
  return new RegExp(`${hasThis ? 'this\\.' : ''}${key}\\b`);
};
