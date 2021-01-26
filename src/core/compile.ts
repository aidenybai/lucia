import { DIRECTIVE_PREFIX, DIRECTIVE_SHORTHANDS } from '../models/generics';
import { State, DirectiveKV, ASTNode } from '../models/structs';
import { expressionPropRE, hasDirectiveRE, eventDirectivePrefixRE } from './utils/patterns';
import compute from './utils/computeExpression';

export const removeDupesFromArray = (array: any[]): any[] => [...new Set(array)];

export const isListRenderScope = (el: HTMLElement) => {
  return el.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};

export const isUnderListRenderScope = (el: HTMLElement) => {
  if (!el.parentElement) return false;
  return el.parentElement!.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};

export const createASTNode = (el: HTMLElement, state: State): ASTNode | null => {
  const [directives, deps] = collectAndInitDirectives(el, state);

  // Check if there are directives
  const hasDirectives = Object.keys(directives).length > 0;
  // Check if there are affected props in state
  const hasDepInDirectives = Object.values(directives).some(({ value }) =>
    Object.keys(state).some((prop) => expressionPropRE(prop).test(value))
  );

  if (!hasDirectives) return null;
  return {
    el,
    deps: deps as string[],
    directives: directives as DirectiveKV,
    type: hasDepInDirectives ? 1 : 0,
  };
};

export const collectAndInitDirectives = (
  el: HTMLElement,
  state: State = {}
): (DirectiveKV | string[])[] => {
  const directives: DirectiveKV = {};
  const nodeDeps = [];

  if (el.attributes) {
    for (const { name, value } of el.attributes) {
      const depsInFunctions: string[] = [];
      const propsInState: string[] = Object.keys(state);
      let returnable = true;

      // Finds the dependencies of a directive expression
      const deps: string[] = propsInState.filter((prop) => {
        const hasDep = expressionPropRE(prop).test(String(value));

        if (typeof state[prop] === 'function' && hasDep) {
          const depsInFunction = propsInState.filter((p) =>
            expressionPropRE(p).test(String(state[prop]))
          );
          depsInFunctions.push(...depsInFunction);
        }

        return hasDep;
      });

      if (eventDirectivePrefixRE().test(name)) returnable = false;
      // @ts-ignore
      if (name.includes('for') && el.__l_for_template === undefined) {
        // @ts-ignore
        el.__l_for_template = String(el.innerHTML).trim();
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
      if (name.startsWith(DIRECTIVE_PREFIX)) {
        directives[name.slice(DIRECTIVE_PREFIX.length)] = directiveData;
      } else if (Object.keys(DIRECTIVE_SHORTHANDS).includes(name[0])) {
        directives[`${DIRECTIVE_SHORTHANDS[name[0]]}:${name.slice(1)}`] = directiveData;
      }
    }
  }
  return [directives, removeDupesFromArray(nodeDeps)];
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
