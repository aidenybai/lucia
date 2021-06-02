import compile from '@core/compile';
import { directives } from '@core/directive';
import render from '@core/render';
import { COMPONENT_FLAG, DIRECTIVE_PREFIX, FOR_TEMPLATE_FLAG } from '@models/generics';
import { ASTNode, DirectiveProps } from '@models/structs';
import rewriteWithNewDeps from '@utils/rewriteWithNewDeps';
import computeExpression from '@utils/computeExpression';
import { expressionPropRE, parenthesisWrapReplaceRE } from '@utils/patterns';

// This directive is size-based, not content-based, since everything is compiled and rerendered
// It's also quite expensive on performance, and should be refactored in the future
export const forDirective = ({ el, data, state, node }: DirectiveProps): void => {
  const originalAST = el[COMPONENT_FLAG];
  if (!originalAST) el[COMPONENT_FLAG] = compile(el, state);

  const forLoopRE = /\s+(?:in|of)\s+/gim;
  const [expression, target] = data.value.split(forLoopRE);
  const [item, index] = expression?.trim().replace(parenthesisWrapReplaceRE(), '').split(',');

  // Try to grab by property, else compute it if it's a custom array
  const currArray =
    (state[target?.trim()] as unknown[]) ?? computeExpression(target?.trim(), el, true)(state);

  const template = el[FOR_TEMPLATE_FLAG];
  if (el.innerHTML.trim() === template) el.innerHTML = '';

  // This just checks if there is deviation from both (removal/addition/nochange)
  const arrayDiff = currArray?.length - el.children.length;
  const tableElementRE = /^[^\S]*?<(t(?:head|body|foot|r|d|h))/i;

  if (currArray?.length === 0) el.innerHTML = '';
  else if (arrayDiff !== 0) {
    for (let i = Math.abs(arrayDiff); i > 0; --i) {
      if (arrayDiff < 0) el.removeChild(el.lastChild as Node);
      else {
        let content = String(template);
        const isTable = tableElementRE.test(content);

        /* istanbul ignore next */
        if (item) {
          content = content.replace(
            expressionPropRE(`this\\.${item.trim()}`),
            `${target}[${currArray.length - i}]`,
          );
        }
        if (index) {
          content = content.replace(
            expressionPropRE(`this\\.${index.trim()}`),
            String(currArray.length - i),
          );
        }

        // Needing to wrap table elements, else they disappear
        if (isTable) content = `<table>${content}</table>`;

        const fragment = document.createRange().createContextualFragment(content);

        // fragment and fragment.firstElementChild return the same result
        // so we have to do it two times for the table, since we need
        // to unwrap the temporary wrap
        // @ts-expect-error: firstElementChild will exist since <table> exists
        el.appendChild(isTable ? fragment.firstElementChild.firstElementChild : fragment);
      }
    }
    el[COMPONENT_FLAG] = compile(el, state);
  }

  if (!originalAST) {
    // Deps recompiled because child nodes may have additional deps
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    rewriteWithNewDeps(el[COMPONENT_FLAG] as ASTNode[], data.deps, node!, 'for');
    el.removeAttribute(`${DIRECTIVE_PREFIX}for`);
  }

  // Only recompile if there is no increase/decrease in array size, else use the original AST
  const ast = arrayDiff === 0 ? (originalAST as ASTNode[]) : compile(el, state, true);
  /* istanbul ignore next */
  render(ast || [], directives, state, node?.deps || []);
};
