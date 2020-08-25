export default {
  curlyBraceTrimRegex: /(\{)\s*(\S+)\s*(?=})/gim,
  matchInteropRegex: /{{\s*(#[^\s\\]+ )?[^\s\\]+.[^\s\\]\s*}}/g,
  directives: {
    prefix: 'l-',
    ids: ['on', 'bind', 'if'],
  },
};
