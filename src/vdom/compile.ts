import { DIRECTIVE_PREFIX } from '../models/generics';
import { State, DOMNode } from '../models/structs';

import collectAndInitDirectives from './utils/collectAndInitDirectives';
import { expressionPropRE, hasDirectiveRE } from './utils/patterns';

export const createDOMNode = (el: HTMLElement, state: State): DOMNode | null => {
  let isDynamic = false;
  const directives = collectAndInitDirectives(el, state);

  // Check if there are directives
  const hasDirectives = Object.keys(directives).length > 0;
  // Check if there are affected keys in values
  const hasKeyInDirectives = Object.values(directives).some(({ value }) =>
    Object.keys(state).some((key) => expressionPropRE(key, false).test(value))
  );
  if (!hasDirectives) return null;
  if (hasKeyInDirectives) isDynamic = true;

  return {
    el,
    directives,
    isDynamic,
  };
};

export const isListRenderScope = (el: HTMLElement) => {
  return el.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};

export const isUnderListRenderScope = (el: HTMLElement) => {
  if (!el.parentElement) return false;
  return el.parentElement!.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};

export const extractNodeChildrenAsCollection = (rootNode: HTMLElement) => {
  if (isUnderListRenderScope(rootNode) || isListRenderScope(rootNode)) return [];
  
  const collection: HTMLElement[] = [rootNode];

  for (const childNode of rootNode.childNodes) {
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      if (isListRenderScope(childNode as HTMLElement)) collection.push(childNode as HTMLElement);
      else {
        collection.push(...extractNodeChildrenAsCollection(childNode as HTMLElement));
      }
    }
  }

  return collection;
};

export const compile = (el: HTMLElement, state: State = {}): DOMNode[] => {
  if (!el) throw new Error('Please provide a Element');

  const DOMNodes: DOMNode[] = [];
  const nodes: HTMLElement[] = extractNodeChildrenAsCollection(el);

  for (const node of nodes) {
    if (hasDirectiveRE().test(node.outerHTML)) {
      const newDOMNode = createDOMNode(node, state);
      if (newDOMNode) DOMNodes.push(newDOMNode);
    }
  }

  return DOMNodes;
};

export default compile;
