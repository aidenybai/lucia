import {
  COMPONENT_FLAG,
  DIRECTIVE_PREFIX,
  DIRECTIVE_SHORTHANDS,
  FOR_TEMPLATE_FLAG,
} from '@models/generics';
import { ASTNode, ASTNodeType, DirectiveKV, Refs, State } from '@models/structs';
import compute from '@utils/computeExpression';
import { eventDirectivePrefixRE, expressionPropRE, hasDirectiveRE } from '@utils/patterns';
import removeDupesFromArray from '@utils/removeDupesFromArray';

export const isListRenderScope = (el: HTMLElement): boolean => {
  return el.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};

export const isUnderListRenderScope = (el: HTMLElement): boolean => {
  return !!el.parentElement && el.parentElement.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};

export const createASTNode = (el: HTMLElement, state: State): ASTNode | undefined => {
  const [directives, deps] = collectAndInitDirectives(el, state);

  const hasDirectives = Object.keys(directives).length > 0;
  const hasDepInDirectives = Object.values(directives).some(({ value }) =>
    Object.keys(state).some((prop) => expressionPropRE(prop).test(value)),
  );
  const type = hasDepInDirectives ? ASTNodeType.DYNAMIC : ASTNodeType.STATIC;
  const node = { el, deps, directives, type };

  return hasDirectives ? node : undefined;
};

export const collectRefs = (element: HTMLElement | Document = document): Refs => {
  const refDirective = `${DIRECTIVE_PREFIX}ref`;
  const refElements = element.querySelectorAll(`[${refDirective}]`);
  const refs = {};
  refElements.forEach((refElement) => {
    const name = refElement.getAttribute(refDirective);
    /* istanbul ignore next */
    if (name) refs[name] = refElement;
  });
  return refs;
};

/* istanbul ignore next */
export const collectAndInitDirectives = (
  el: HTMLElement,
  state: State = {},
): [DirectiveKV, string[]] => {
  const directives: DirectiveKV = {};
  const refs: Refs = collectRefs();
  const nodeDeps = [];

  for (const { name, value } of el.attributes) {
    const isStateDirective = name === `${DIRECTIVE_PREFIX}state`;
    const hasDirectivePrefix = name.startsWith(DIRECTIVE_PREFIX);
    const hasDirectiveShorthandPrefix = Object.keys(DIRECTIVE_SHORTHANDS).some((shorthand) =>
      name.startsWith(shorthand),
    );

    if (isStateDirective || !(hasDirectivePrefix || hasDirectiveShorthandPrefix)) continue;

    const depsInFunctions: string[] = [];
    const propsInState: string[] = Object.keys(state);
    let returnable = true;

    // Finds the dependencies of a directive expression
    const deps: string[] = propsInState.filter((prop) => {
      const hasDep = expressionPropRE(prop).test(String(value));

      // Check for dependencies inside functions
      /* istanbul ignore next */
      if (hasDep && typeof state[prop] === 'function') {
        const depsInFunction = propsInState.filter((p) => {
          return expressionPropRE(p).test(String(state[prop]));
        });
        depsInFunctions.push(...depsInFunction);
      }

      return hasDep;
    });

    if (eventDirectivePrefixRE().test(name)) returnable = false;

    // for directive requires a template
    if (name.includes('for') && el[FOR_TEMPLATE_FLAG] === undefined) {
      el[FOR_TEMPLATE_FLAG] = String(el.innerHTML).trim();
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
    /* istanbul ignore next */
    const directiveName = hasDirectivePrefix
      ? name.slice(DIRECTIVE_PREFIX.length)
      : `${DIRECTIVE_SHORTHANDS[name[0]]}:${name.slice(1)}`;

    directives[directiveName.toLowerCase()] = directiveData;
  }

  return [directives, removeDupesFromArray(nodeDeps)];
};

export const flattenElementChildren = (
  rootElement: HTMLElement,
  isListGroup = false,
  ignoreRootElement = false,
): HTMLElement[] => {
  const collection: HTMLElement[] = [];
  const isList = isListRenderScope(rootElement);
  const isUnderList = isUnderListRenderScope(rootElement);

  // Return nothing if it isn't list compilation and is a list or under a list
  if (!isListGroup && (isList || isUnderList)) return collection;
  // Add root elem to return array if it isn't a list or under a list
  if (!ignoreRootElement && (!isListGroup || !isList)) collection.push(rootElement);

  // Is not a list or under a list, but pass if is a list group
  /* istanbul ignore next */
  if (isListGroup || (!isList && !isUnderList)) {
    for (const childElement of rootElement.children) {
      // Check if childElement has attributes
      if (childElement instanceof HTMLElement) {
        if (!isListGroup && isListRenderScope(childElement)) {
          // Push root if it is a list render (don't want to push unrendered template)
          collection.push(childElement);
        } else {
          // Skip over nested components (independent compile request)
          if (childElement.hasAttribute(`${DIRECTIVE_PREFIX}state`)) continue;
          // Push all children into array (recursive flattening)
          collection.push(
            ...flattenElementChildren(
              childElement,
              isListGroup,
              childElement.attributes.length === 0,
            ),
          );
        }
      }
    }
  }

  return collection;
};

export const compile = (el: HTMLElement, state: State, ignoreRootElement = false): ASTNode[] => {
  const ast: ASTNode[] = [];
  const isListGroup = el[COMPONENT_FLAG] !== undefined && isListRenderScope(el);
  const elements: HTMLElement[] = flattenElementChildren(el, isListGroup, ignoreRootElement);

  /* istanbul ignore next */
  elements.forEach((element) => {
    if (hasDirectiveRE().test(element.outerHTML)) {
      const newASTNode = createASTNode(element, state);
      if (newASTNode) {
        ast.push(newASTNode);
      }
    }
  });

  return ast;
};

export default compile;
