export const DIRECTIVE_PREFIX = 'l-';
export const LUCIA_COMPILE_REQUEST = '%LUCIA_COMPILE_REQUEST%';
export enum DIRECTIVE_SHORTHANDS {
  '@' = 'ON',
  ':' = 'BIND',
}

export type UnknownKV = Record<string, unknown>;
export type StringKV = Record<string, string>;
