import { DIRECTIVE_PREFIX, DIRECTIVE_SHORTHANDS } from '../models/generics';
import { State, DirectiveKV, ASTNode } from '../models/structs';
import { expressionPropRE, hasDirectiveRE, eventDirectivePrefixRE } from './utils/patterns';
import { getElementCustomProp, setElementCustomProp } from './utils/elementCustomProp';
import removeDupesFromArray from './utils/removeDupesFromArray';
import compute from './utils/computeExpression';

export const isListRenderScope = (el: HTMLElement): boolean => {
  return el.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};

export const isUnderListRenderScope = (el: HTMLElement): boolean => {
  if (!el.parentElement) return false;
  return el.parentElement.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};

export const createASTNode = (el: HTMLElement, state: State): ASTNode | null => {
  const [directives, deps] = collectAndInitDirectives(el, state);

  // Check if there are directives
  const hasDirectives = Object.keys(directives).length > 0;

  // Check if there are affected props in state
  const hasDepInDirectives = Object.values(directives).some(({ value }) =>
    Object.keys(state).some((prop) => expressionPropRE(prop).test(value))
  );
  const type = hasDepInDirectives ? 1 : 0;

  if (!hasDirectives) return null;

  return { el, deps, directives, type };
};

export const collectAndInitDirectives = (
  el: HTMLElement,
  state: State = {}
): [DirectiveKV, string[]] => {
  const directives: DirectiveKV = {};
  const nodeDeps = [];

  for (const { name, value } of el.attributes) {
    const isStateDirective = name === `${DIRECTIVE_PREFIX}state`;
    const hasDirectivePrefix = name.startsWith(DIRECTIVE_PREFIX);
    const hasDirectiveShorthandPrefix = Object.keys(DIRECTIVE_SHORTHANDS).some((shorthand) =>
      name.startsWith(shorthand)
    );

    if (isStateDirective || !(hasDirectivePrefix || hasDirectiveShorthandPrefix)) continue;

    const depsInFunctions: string[] = [];
    const propsInState: string[] = Object.keys(state);
    let returnable = true;

    // Finds the dependencies of a directive expression
    const deps: string[] = propsInState.filter((prop) => {
      const hasDep = expressionPropRE(prop).test(String(value));

      // Compare toString value of function
      if (typeof state[prop] === 'function' && hasDep) {
        const depsInFunction = propsInState.filter((p) =>
          expressionPropRE(p).test(String(state[prop]))
        );
        depsInFunctions.push(...depsInFunction);
      }

      return hasDep;
    });

    if (eventDirectivePrefixRE().test(name)) returnable = false;
    if (name.includes('for') && getElementCustomProp(el, '__l_for_template') === undefined) {
      setElementCustomProp(el, '__l_for_template', String(el.innerHTML).trim());
      returnable = false;
    }

    const uniqueCompiledDeps = removeDupesFromArray([...deps, ...depsInFunctions]);
    nodeDeps.push(...uniqueCompiledDeps);

    const directiveData = {
      compute: compute(value, el, returnable),
      deps: uniqueCompiledDeps,
      value,
    };

    // Handle normal and shorthand directives
    const directiveName = hasDirectivePrefix
      ? name.slice(DIRECTIVE_PREFIX.length)
      : `${DIRECTIVE_SHORTHANDS[name[0]]}:${name.slice(1)}`;

    directives[directiveName] = directiveData;
  }

  return [directives, removeDupesFromArray(nodeDeps)];
};

export const flattenNodeChildren = (
  rootNode: HTMLElement,
  isListGroup: boolean = false,
  ignoreRootNode: boolean = false
): HTMLElement[] => {
  const collection: HTMLElement[] = [];
  const isList = isListRenderScope(rootNode);
  const isUnderList = isUnderListRenderScope(rootNode);

  // Return nothing if it isn't list compilation and is a list or under a list
  if (!isListGroup && (isList || isUnderList)) return collection;
  // Add root node to return array if it isn't a list or under a list
  if (!ignoreRootNode && (!isListGroup || !isList)) collection.push(rootNode);

  // Is not a list or under a list, but pass if is a list group
  if (isListGroup || (!isList && !isUnderList)) {
    for (const childNode of rootNode.childNodes) {
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        if (!isListGroup && isListRenderScope(childNode as HTMLElement)) {
          // Push root if it is a list render (don't want to push unrendered template)
          collection.push(childNode as HTMLElement);
        } else {
          // Skip over nested components (independent compile request)
          if ((childNode as HTMLElement).hasAttribute(`${DIRECTIVE_PREFIX}state`)) continue;
          // Push all children into array (recursive flattening)
          collection.push(...flattenNodeChildren(childNode as HTMLElement, isListGroup));
        }
      }
    }
  }

  return collection;
};

export const compile = (
  el: HTMLElement,
  state: State = {},
  ignoreRootNode: boolean = false
): ASTNode[] => {
  if (!el) throw new Error('Please provide a HTMLElement');

  const ast: ASTNode[] = [];
  const isListGroup = getElementCustomProp(el, '__l') !== undefined && isListRenderScope(el);
  const nodes: HTMLElement[] = flattenNodeChildren(el, isListGroup, ignoreRootNode);

  for (const node of nodes) {
    if (node.hasAttribute(`${DIRECTIVE_PREFIX}mask`)) {
      node.removeAttribute(`${DIRECTIVE_PREFIX}mask`);
    }
    if (hasDirectiveRE().test(node.outerHTML)) {
      // Creates AST Node from real DOM nodes
      const newASTNode = createASTNode(node, state);
      if (newASTNode) ast.push(newASTNode);
    }
  }

  return ast;
};

export default compile;
