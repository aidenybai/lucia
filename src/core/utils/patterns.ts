import { DIRECTIVE_PREFIX, DIRECTIVE_SHORTHANDS } from '@models/generics';

// Split directive:modifier.property
export const rawDirectiveSplitRE = (): RegExp => /:|\./gim;
export const eventDirectivePrefixRE = (): RegExp => /on|@/gim;
export const parenthesisWrapReplaceRE = (): RegExp => /\(|\)/gim;
export const curlyTemplateRE = (): RegExp => /{{\s*(\w+)\s*}}/gim;
export const hasDirectiveRE = (): RegExp => {
  return new RegExp(
    `(${DIRECTIVE_PREFIX}|${Object.keys(DIRECTIVE_SHORTHANDS).join('|')})\\w+`,
    'gim',
  );
};
export const expressionPropRE = (prop: string): RegExp => {
  // Utilizes \b (word boundary) for prop differentiation.
  // Fails when next character is a \w (Word).
  return new RegExp(`\\b${prop}\\b`, 'gim');
};
