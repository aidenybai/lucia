import { ASTNode } from '../../models/structs';
import removeDupesFromArray from './removeDupesFromArray';

export const adjustDeps = (
  ast: ASTNode[],
  currentDeps: string[],
  node: ASTNode,
  directiveName: string
) => {
  const deps = [];

  for (const childNode of ast) {
    deps.push(...childNode.deps);
  }

  const cleanedDeps = removeDupesFromArray([...currentDeps, ...deps]);

  // Update deps for directive
  node.deps = cleanedDeps;
  node.directives[directiveName].deps = cleanedDeps;
};

export default adjustDeps;
