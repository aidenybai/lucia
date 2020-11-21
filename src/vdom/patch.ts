import render from '../directives/render';
import { VNode, VNodeTypes } from './h';

const patch = (
  originVNode: VNode | null,
  view: Record<string, any> = {},
  keys: string[] = [],
): Record<any, any> | any => {
  if (!originVNode) return;

  for (let node of originVNode.children) {
    if (typeof node === 'string') continue;

    // Check if it is not a static VNode by type
    if (node.type > VNodeTypes.STATIC) {
      const { attributes, directives, sel } = node.props;
      const affectedDirectives = [];

      for (const name in directives as Record<string, any>) {
        const value = directives[name];
        // Iterate through affected keys and check if directive value has key
        const hasKey = keys.some((key) => value.toString().includes(key));
        // Iterate through view keys
        const hasKeyInFunction = Object.keys(view).some((key: string) => {
          // Check if function and function content, iterate through affected
          // keys and check if function content contains affected key
          return (
            typeof view[key] === 'function' &&
            keys.some((k) => view[key].toString().includes(`this.${k}`))
          );
        });
        // If affected, then push to render queue
        if (hasKey || hasKeyInFunction) {
          affectedDirectives.push(name);
        }
      }

      // Switch one time patch nodes to static (l-use and l-init unaffected)
      if (node.type === VNodeTypes.NEEDS_PATCH) {
        node.type = VNodeTypes.STATIC;
      }

      for (const name of affectedDirectives) {
        const value = directives[name];
        const el = attributes.id
          ? document.getElementById(attributes.id)
          : document.querySelector(sel as string);

        // Render directive
        render({
          el,
          name,
          value,
          view,
        });
      }
    }

    if (node.children.length > 0) patch(node, view, keys);
  }
};

export default patch;
