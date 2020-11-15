import render from '../directives/render';

const patch = (
  vnodes: any /* VNode | null */,
  view: Record<string, any> = {},
  keys: string[] = [],
  callSelf: boolean = false
): Record<any, any> | any => {
  if (!vnodes) return;

  for (let i = 0; i < vnodes.children.length; i++) {
    let vnode = vnodes.children[i];
    if (typeof vnode === 'string') continue;

    if (vnode.type > 0) {
      const { attributes, directives, sel } = vnode.data;
      const affectedDirectives = [];
      for (const name in directives as any) {
        const value = directives[name];
        if (
          keys.some((key) => value.toString().includes(key)) ||
          Object.keys(view).some((key: string) => {
            return (
              typeof view[key] === 'function' &&
              keys.some((k) => view[key].toString().includes(`this.${k}`))
            );
          })
        ) {
          affectedDirectives.push(name);
        }
      }

      if (affectedDirectives.length > 0 && Object.keys(directives).includes('on:effect')) {
        affectedDirectives.push('on:effect'); // Probably should make this more efficient in the future
      }

      if (vnode.type === 1) {
        vnode.type = 0;
      }

      for (const name of affectedDirectives) {
        const value = directives[name];
        const el = attributes.id
          ? document.getElementById(attributes.id)
          : document.querySelector(sel);

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
  if (callSelf) return vnodes;
};

export default patch;
