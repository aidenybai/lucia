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

export const extractNodeChildrenAsCollection = (
  rootNode: HTMLElement,
  isListGroup: boolean = false
) => {
  const collection: HTMLElement[] = [];
  const isList = isListRenderScope(rootNode);
  const isUnderList = isUnderListRenderScope(rootNode);

  if (!isListGroup && (isList || isUnderList)) return collection;
  if (!isListGroup || !isList) collection.push(rootNode);

  for (const childNode of rootNode.childNodes) {
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      if (!isListGroup && isListRenderScope(childNode as HTMLElement)) collection.push(childNode as HTMLElement);
      else {
        collection.push(...extractNodeChildrenAsCollection(childNode as HTMLElement, true));
      }
    }
  }

  return collection;
};

export const compile = (el: HTMLElement, state: State = {}): DOMNode[] => {
  if (!el) throw new Error('Please provide a Element');

  const DOMNodes: DOMNode[] = [];
  // @ts-ignore
  const isListGroup = el.__l !== undefined && isListRenderScope(el);
  const nodes: HTMLElement[] = extractNodeChildrenAsCollection(el, isListGroup);

  for (const node of nodes) {
    if (hasDirectiveRE().test(node.outerHTML)) {
      if (
        node.hasAttribute(`${DIRECTIVE_PREFIX}state`) ||
        node.hasAttribute(`${DIRECTIVE_PREFIX}href`)
      ) {
        continue;
      }
      const newDOMNode = createDOMNode(node, state);
      if (newDOMNode) DOMNodes.push(newDOMNode);
    }
  }

  return DOMNodes;
};

export default compile;
