- [Virtual DOM Documentation](#virtual-dom-documentation)
  - [Design principles](#design-principles)
- [Overview](#overview)
  - [Compile phase](#compilation-phase)
  - [Patching phase](#patching-phase)
  - [Watching phase](#watching-phase)

# Virtual DOM Documentation

This document covers how Lucia's Virtual DOM works. It's intended to aid in understanding the code, ad helping contributors work with it.

Note that there are some design decisions that make Lucia's Virtual DOM somewhat unorthodox. Keep in mind that this project is quite young and unstable, and some of the implementations are bound to change down the road.

## Design Principles

The Lucia Virtual DOM is designed to accomplish a balance between being **fast and compact**, by trying to execute as **few DOM operations** as it can. It achieves this by relying on directives, taking the view from a root DOM node.

- **Avoid doing unnecessary work**

  Many JavaScript libraries use Virtual DOMs like Lucia does, however Lucia's footprint is small and considers state as immutable, meaning instead of compiling and diffing, it just changes the Element reference when necessary.

- **Utilize modularity and functional programming**

  The Virtual DOM is purposely unstructured to allow developer flexibility and code, allowing for higher level code to be abstracted and structured systems.

- **Keep the core as lightweight as possible**

  The goal of Lucia is to be as light as possible, meaning that to achieve this, less code needs to be written. The core should be as fundemental and simple as possible, with abstractions filling in the additional functionality.

## Overview

![Flowchart Overview](https://chart.googleapis.com/chart?cht=gv&chl=graph{Virtual_DOM--Compile[type=s];Virtual_DOM--Patch[type=s];Virtual_DOM--Watch[type=s];})

### Compilation phase

This phase takes in real DOM nodes, provided by the user and compiles them into an immutable VNode tree. The Virtual DOM provides the `compile()` and `h()` functions for this purpose.

```js
// Converts <div><div>Hello World!</div></div> into:
h('div', [h('div', ['Hello World!'])]);

// Which returns this:
{
  tag: 'div',
  children: [
    {
      tag: 'div',
      children: ['Hello World'],
      props: {...},
    }
  ],
  props: {...},
};
```

### Patching phase

This phase takes compiled VNodes and a mutable view, traversig the tree and rendering dynamic nodes' directives. The patch phase skips over static VNodes to maintain performance. Note that `patch()` requires a parent wrapper VNode.

**VNode Types**:

0. `STATIC` - Static VNode (no patching necessary)
1. `NEEDS_PATCH` - Uninitialized static VNode (needs one patch)
2. `DYNAMIC` - dynamic VNode (needs patch every time view changes)

```diff
{
  tag: 'div',
  children: [],
  props: {
    attributes: {},
    directives: {
+     text: 'old',
-     text: 'new',
    },
    ref: <HTMLElement>,
    type: 2,
  }
}
```

### Watching phase

This phase observes the view and emits a patch request every time the view is changed. This uses deep proxy function `observer()` that captures and propogates a callback, such as `patch()` on change.

```js
// Wrap object with observer to create view
const view = observer({...}, callback);

view.foo // nothing is called
view.foo = 'bar'; // callback(...) is called
delete view.foo; // callback(...) is called
```
