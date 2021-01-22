import { DIRECTIVE_PREFIX } from '../models/generics';
import { State, DirectiveKV, ASTNode } from '../models/structs';

import collectAndInitDirectives from './utils/collectAndInitDirectives';
import { expressionPropRE, hasDirectiveRE } from './utils/patterns';

export const createASTNode = (el: HTMLElement, state: State): ASTNode | null => {
  const [directives, keys] = collectAndInitDirectives(el, state);

  // Check if there are directives
  const hasDirectives = Object.keys(directives).length > 0;
  // Check if there are affected keys in values
  const hasKeyInDirectives = Object.values(directives).some(({ value }) =>
    Object.keys(state).some((key) => expressionPropRE(key).test(value))
  );

  if (!hasDirectives) return null;
  return {
    el,
    keys: keys as string[],
    directives: directives as DirectiveKV,
    type: hasKeyInDirectives ? 1 : 0,
  };
};

export const isListRenderScope = (el: HTMLElement) => {
  return el.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};

export const isUnderListRenderScope = (el: HTMLElement) => {
  if (!el.parentElement) return false;
  return el.parentElement!.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};

export const extractNodeChildrenAsCollection = (
  rootNode: HTMLElement,
  isListGroup: boolean = false
) => {
  const collection: HTMLElement[] = [];
  const isList = isListRenderScope(rootNode);
  const isUnderList = isUnderListRenderScope(rootNode);

  // Return nothing if it isn't list compilation and is a list or under a list
  if (!isListGroup && (isList || isUnderList)) return collection;
  // Add root node to return array if it isn't a list or under a list
  if (!isListGroup || !isList) collection.push(rootNode);

  // Is not a list or under a list, but pass if is a list group
  if ((!isList && !isUnderList) || isListGroup) {
    for (const childNode of rootNode.childNodes) {
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        if (!isListGroup && isListRenderScope(childNode as HTMLElement)) {
          // Push root if it is a list render (don't want to push unrendered template)
          collection.push(childNode as HTMLElement);
        } else {
          // Push all children into array (recursive flattening)
          collection.push(
            ...extractNodeChildrenAsCollection(childNode as HTMLElement, isListGroup)
          );
        }
      }
    }
  }

  return collection;
};

export const compile = (el: HTMLElement, state: State = {}): ASTNode[] => {
  if (!el) throw new Error('Please provide a Element');

  const ast: ASTNode[] = [];
  // @ts-ignore
  const isListGroup = el.__l !== undefined && isListRenderScope(el);
  const nodes: HTMLElement[] = extractNodeChildrenAsCollection(el, isListGroup);

  for (const node of nodes) {
    if (hasDirectiveRE().test(node.outerHTML)) {
      if (node.hasAttribute(`${DIRECTIVE_PREFIX}state`)) {
        continue;
      }
      // Creates AST Node from real DOM nodes
      const newASTNode = createASTNode(node, state);
      if (newASTNode) ast.push(newASTNode);
    }
  }

  return ast;
};

export default compile;
