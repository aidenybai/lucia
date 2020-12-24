import { LUCIA_FIRST_RENDER, UnknownKV } from '../models/generics';
import { DirectiveApp } from '../models/structs';
import { VNode, VNodeTypes } from '../models/vnode';

import { renderDirective } from './directive';
import { keyPattern } from './utils/patterns';

// Using patch requires a wrapper parent VNode

const patch = (rootVNode: VNode, app: DirectiveApp = {}, keys?: string[]): void => {
  let firstRender = false;
  const state = app.state || {};

  if (!rootVNode) return;
  if (!keys) keys = Object.keys(state);
  // Compile request is for sweeping initialization
  if (keys[0] === LUCIA_FIRST_RENDER) firstRender = true;

  for (let node of rootVNode.children) {
    if (typeof node === 'string') continue;

    // Check if it is not a static VNode by type
    if (node.props.type > VNodeTypes.STATIC) {
      const { attributes, directives, ref, type } = node.props;
      let affectedDirectives: string[] = [];

      if (!firstRender) {
        for (const name in directives as UnknownKV) {
          const needsInit = type === 1;
          // Iterate through affected keys and check if directive value has key
          const hasKey = keys.some((key) => keyPattern(key).test(String(directives[name].value)));
          // Iterate through state keys
          const hasKeyInFunction = Object.keys(state).some((key: string) => {
            // Check if function and function content, iterate through affected
            // keys and check if function content contains affected key
            const iterKeysInFunction = (keys as string[]).some((k) =>
              keyPattern(k).test(String(state[key] as Function))
            );
            return typeof state[key] === 'function' && iterKeysInFunction;
          });

          // If affected, then push to render queue
          if (needsInit || hasKey || hasKeyInFunction) {
            affectedDirectives.push(name);
          }
        }
      }

      // Switch one time patch nodes to static (l-use and l-init unaffected)
      node.props.type = type === VNodeTypes.NEEDS_PATCH ? VNodeTypes.STATIC : type;

      // If compileRequest, then use keys of norm directives
      const directivesToRender: string[] = firstRender
        ? Object.keys(directives)
        : affectedDirectives;

      directivesToRender.map((name) => {
        const data = directives[name];
        const el = (attributes.id ? document.getElementById(attributes.id) : ref) as HTMLElement;

        renderDirective({ el, name, data, app }, { ...app.directives });
      });
    }

    if (node.children.length > 0) patch(node, app, keys);
  }
};

export default patch;
