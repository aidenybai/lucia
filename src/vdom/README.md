# Lucia Virtual DOM

> This is an unfinished page.

The Lucia Virtual DOM is designed to accomplish a balance between being **fast and compact**, by trying to execute as **few DOM operations** as it can. It achieves this by relying on directives, taking the view from a root DOM node. The Virtual DOM code consists of 4 prepackaged files:

- [**`h.ts`**](h.ts) - Contains `h`, a hyperscript function and VNode interface
- [**`compile.ts`**](compile.ts) - Contains `compile` function, which turns HTML into a VNode tree.
- [**`patch.ts`**](patch.ts) - Updates VNodes that need modification with new view. Note that patching requires a parent wrapper VNode.
- [**`observer.ts`**](observer.ts) - Deep proxy function that captures and propogates a callback, such as `patch` on change.

## Example Compiler Output

```js
// Input: <div><div>Hello World!</div></div>

// Wrapper VNode
h('div', [h('div', ['Hello World!'])]);
```

## VNode Anatomy

```js
// VNode: <div id="app"></div>

{
  tag: 'div',
  children: [],
  props: {
    attributes: { id: 'app' },
    directives: {},
    ref: undefined, // Only is created if VNode is type 1 or 2
    type: 0,
  },
};
```

## VNode Types

0. `STATIC` - Static VNode (no patching necessary)
1. `NEEDS_PATCH` - Uninitialized static VNode (needs one patch)
2. `DYNAMIC` - dynamic VNode (needs patch every time view changes)

## How Lucia uses the Virtual DOM

1. Grabs the element reference of a selected root node.
2. Walks down the Node tree of that root node and generates VNodes using `h()` and returns the output as a tree using `compile()`.
3. Creates instance of `observer()` to watch view.
4. Perform an initial `patch()`.

You can also technically create your own library around this Virtual DOM as well.
