export default {
  curlyBraceTrimRegex: /(\{)\s*(\S+)\s*(?=})/gim, // Removes the padding between curly braces: {{ test }} -> {{test}}
  matchInteropRegex: /{{\s*(#[^\s\\]+ )?[^\s\\]+.[^\s\\]\s*}}/g, // Gets {{data}}
};