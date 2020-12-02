- [Virtual DOM Documentation](#virtual-dom-documentation)
  - [Design principles](#design-principles)
- [Overview](#overview)
  - [Compile phase](#compilation-phase)
  - [Patching phase](#patching-phase)
  - [Watching phase](#watching-phase)
  - [Directive phase](#directive-phase)

# Virtual DOM Documentation

This document covers how Lucia's Virtual DOM works. It's intended to aid in understanding the code, and helping contributors work with it.

Note that there are some design decisions that make Lucia's Virtual DOM somewhat unorthodox. Keep in mind that this project is quite young and unstable, and some of the implementations are bound to change down the road.

The Virtual DOM in Lucia isn't used to be mutated and synced with the DOM, rather it is used as an augmentation of the DOM for reference during patching. This mean in the core, no diffing occurs and values that are compiled are never changed.

The reasoning behind this architectural decision isn't necessarily because it is more efficient, rather it's just not necessary in Lucia's use case, as it depends on directives rather than custom state.

## Design Principles

The Lucia Virtual DOM is designed to accomplish a balance between being **fast and compact**, by trying to execute as **few DOM operations** as it can. It achieves this by relying on directives, taking the view from a root DOM node.

- **Avoid doing unnecessary work**

  Many JavaScript libraries use Virtual DOMs like Lucia does, however Lucia's footprint is small and considers state as immutable, meaning instead of compiling and diffing, it just changes the Element reference when necessary.

- **Utilize modularity and functional programming**

  The Virtual DOM is purposely unstructured to allow developer flexibility and code, allowing for higher level code to be abstracted and structured systems.

- **Keep the core as lightweight as possible**

  The goal of Lucia is to be as light as possible, meaning that to achieve this, less code needs to be written. The core should be as fundemental and simple as possible, with abstractions filling in the additional functionality.

## Overview

![Flowchart Overview](https://chart.googleapis.com/chart?cht=gv&chl=graph{Virtual_DOM--Compile[type=s];Reconciliation--Directives[type=s];Compile--Reconciliation[type=s];Reconciliation--Patch[type=s];Reconciliation--Observer[type=s];})

### Compilation phases

Compilation with `compile()` depends on a root element, and traverses the branches of the children DOM tree recursively, reassembling it into a virtual tree of VNodes and marking VNodes based on the view, which is later used down the line to perform intelligent patching.

In Lucia, components act like flags. If a component is registered, during compilation it would be identified and flagged, which is replaced by a hydrated template. This is done by creating a pseudo element, setting the `innerHTML` of that to a callable template. This essentially "hydrates" the template, converting it into elements.

**Example:**

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

This phase takes compiled VNodes and a mutable view, traversing the tree and rendering dynamic nodes' directives. The patch phase skips over static VNodes to maintain performance. Note that `patch()` requires a parent wrapper VNode.

**VNode Types:**

| ID  | Description                                                     |
| --- | --------------------------------------------------------------- |
| 0   | `STATIC` - Static VNode (no patching necessary)                 |
| 1   | `NEEDS_PATCH` - Uninitialized static VNode (needs one patch)    |
| 2   | `DYNAMIC` - dynamic VNode (needs patch every time view changes) |

**Example:**

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

This phase observes the view and emits a patch request every time the view is changed. This uses deep proxy function `observer()` that captures and propogates a callback, such as `patch()` on change. `observer()` allows for concise key selection, meaning that specific keys can be passed, ignoring other view data to speed up performance. Its also handles Array traps as props are passed on mutation.

**Example:**

```js
// Wrap object with observer to create view
const view = observer({...}, callback);

view.foo // Nothing is called
view.foo = 'bar'; // callback(...) is called
delete view.foo; // callback(...) is called
```

### Directive phase

This phase regards directives, which are custom element attributes that serve as hooks that provide computational logic and functionality. A directive manager must be instantiated, which then can be used to render directive callbacks and register custom directives. Directive syntax is as follows:

```bash
PREFIX-DIRECTIVE:MODIFIER.PROPERTY="VALUE"

ex. l-on:click.prevent="this.click()"
```

Logic through the directive is supported by property computation, which runs the value through a sandbox, binded with the view and grabs the output. In this value, you are also able to access "magic properties", prefixed with `$`, such as `$el` without referencing `this`.
