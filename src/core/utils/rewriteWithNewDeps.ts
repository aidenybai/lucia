import { ASTNode } from '@models/structs';
import removeDupesFromArray from './removeDupesFromArray';

export const rewriteWithNewDeps = (
  ast: ASTNode[],
  currentDeps: string[],
  node: ASTNode,
  directiveName: string,
): void => {
  const deps: string[] = [];

  ast.forEach((node) => {
    deps.push(...node.deps);
  });

  const cleanedDeps = removeDupesFromArray([...currentDeps, ...deps]);

  // Update deps for directive
  node.deps = cleanedDeps;
  node.directives[directiveName].deps = cleanedDeps;
};

export default rewriteWithNewDeps;
