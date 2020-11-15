import render from '../directives/render';
import { VNode, VNodeTypes } from './h';

const patch = (
  originVNode: VNode | null,
  view: Record<string, any> = {},
  keys: string[] = [],
  callSelf: boolean = false
): Record<any, any> | any => {
  if (!originVNode) return;

  for (let vnode of originVNode.children) {
    if (typeof vnode === 'string') continue;

    if (vnode.type > VNodeTypes.STATIC) {
      const { attributes, directives, sel } = vnode.props;
      const affectedDirectives = [];
      for (const name in directives as any) {
        const value = directives[name];
        const hasKey = keys.some((key) => value.toString().includes(key));
        const hasKeyInFunction = Object.keys(view).some((key: string) => {
          return (
            typeof view[key] === 'function' &&
            keys.some((k) => view[key].toString().includes(`this.${k}`))
          );
        });
        if (hasKey || hasKeyInFunction) {
          affectedDirectives.push(name);
        }
      }

      if (vnode.type === VNodeTypes.NEEDS_PATCH) {
        vnode.type = VNodeTypes.STATIC;
      }

      for (const name of affectedDirectives) {
        const value = directives[name];
        const el = attributes.id
          ? document.getElementById(attributes.id)
          : document.querySelector(sel as string);

        render({
          el,
          name,
          value,
          view,
        });
      }
    }

    vnode = patch(vnode, view, keys, true);
  }
  if (callSelf) return originVNode;
};

export default patch;
