import { DIRECTIVE_PREFIX } from '../../models/generics';
import { DIRECTIVE_SHORTHANDS } from '../../models/generics';

// Split directive:modifier.property
export const rawDirectiveSplitRE = () => /:|\./gim;
export const semicolonCaptureRE = () => /(;)/gim;
export const arrayIndexCaptureRE = () => /\[(\d+)\]/gim;
export const eventDirectivePrefixRE = () => /on|@/gim;
export const parenthesisWrapReplaceRE = () => /\(|\)/gim;
export const curlyTemplateRE = () => /{{\s*(.+)\s*}}/gim;
export const hasDirectiveRE = () => {
  return new RegExp(
    `(${DIRECTIVE_PREFIX}|${Object.keys(DIRECTIVE_SHORTHANDS).join('|')})\\w+`,
    'gim'
  );
};
export const expressionPropRE = (key: string): RegExp => {
  // Utilizes \b (word boundary) for key differentiation.
  // Fails when next character is a \w (Word).
  return new RegExp(`\\b${key}\\b`, 'gim');
};
