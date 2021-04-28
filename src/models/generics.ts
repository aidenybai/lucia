export const DIRECTIVE_PREFIX = 'l-';
export const COMPONENT_FLAG = 'component';
export const FOR_TEMPLATE_FLAG = '__for_template';
export const MODEL_REGISTERED_FLAG = '__model_registered';
export enum DIRECTIVE_SHORTHANDS {
  '@' = 'on',
  ':' = 'bind',
}

export type UnknownKV = Record<string, unknown>;
export type StringKV = Record<string, string>;
