import { DIRECTIVE_PREFIX, DIRECTIVE_SHORTHANDS } from '../models/generics';
import { State, DirectiveKV, Refs, ASTNode, ASTNodeType } from '../models/structs';
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

export const createASTNode = (el: HTMLElement, state: State): ASTNode | undefined => {
  const [directives, deps] = collectAndInitDirectives(el, state);

  const hasDirectives = Object.keys(directives).length > 0;
  const hasDepInDirectives = Object.values(directives).some(({ value }) =>
    Object.keys(state).some((prop) => expressionPropRE(prop).test(value))
  );
  const type = hasDepInDirectives ? ASTNodeType.DYNAMIC : ASTNodeType.STATIC;
  const node = { el, deps, directives, type };

  return hasDirectives ? node : undefined;
};

export const collectRefs = (): Refs => {
  const refs = document.querySelectorAll(`[${DIRECTIVE_PREFIX}ref]`);
  const refObject = {};
  for (const ref of refs) {
    const name = ref.getAttribute(`${DIRECTIVE_PREFIX}ref`);
    if (name) refObject[name] = ref;
  }
  return refObject;
};

export const collectAndInitDirectives = (
  el: HTMLElement,
  state: State = {}
): [DirectiveKV, string[]] => {
  const directives: DirectiveKV = {};
  const refs: Refs = collectRefs();
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

      // Check for dependencies inside functions
      if (hasDep && typeof state[prop] === 'function') {
        const depsInFunction = propsInState.filter((p) => {
          return expressionPropRE(p).test(String(state[prop]));
        });
        depsInFunctions.push(...depsInFunction);
      }

      return hasDep;
    });

    if (eventDirectivePrefixRE().test(name)) returnable = false;

    // for directive requires template
    if (name.includes('for') && getElementCustomProp(el, '__for_template') === undefined) {
      setElementCustomProp(el, '__for_template', String(el.innerHTML).trim());
      returnable = false;
    }

    const uniqueCompiledDeps = removeDupesFromArray([...deps, ...depsInFunctions]);
    nodeDeps.push(...uniqueCompiledDeps);

    const directiveData = {
      compute: compute(value, el, returnable, refs),
      deps: uniqueCompiledDeps,
      value,
    };

    // Handle normal and shorthand directives
    const directiveName = hasDirectivePrefix
      ? name.slice(DIRECTIVE_PREFIX.length)
      : `${DIRECTIVE_SHORTHANDS[name[0]]}:${name.slice(1)}`;

    directives[directiveName.toLowerCase()] = directiveData;
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
  const ast: ASTNode[] = [];
  const isListGroup = getElementCustomProp(el, 'component') !== undefined && isListRenderScope(el);
  const nodes: HTMLElement[] = flattenNodeChildren(el, isListGroup, ignoreRootNode);
  const maskDirective = `${DIRECTIVE_PREFIX}mask`;

  for (const node of nodes) {
    if (node.hasAttribute(maskDirective)) {
      node.removeAttribute(maskDirective);
    }
    if (hasDirectiveRE().test(node.outerHTML)) {
      const newASTNode = createASTNode(node, state);
      if (newASTNode) ast.push(newASTNode);
    }
  }

  return ast;
};

export default compile;
