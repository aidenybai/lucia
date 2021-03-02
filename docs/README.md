### Table of Contents

- [Core Documentation](#core-documentation)
  - [Design principles](#design-principles)
  - [Overview](#overview)
    - [Compiler](#compiler)
    - [Renderer](#renderer)
    - [Observer](#observer)

# Core Documentation

This document covers how Lucia's core works. It's intended to aid in understanding the code, and helping contributors work with it.

Note that there are some design decisions that make Lucia's core somewhat unorthodox. Keep in mind that this project is quite young and unstable, and some of the implementations are bound to change down the road.

The Lucia's core isn't used to be rendered, mutated, and synced with the DOM, rather it is used as a reference of dynamic nodes during rendering. This mean in the core, no explicit diffing occurs and values that are compiled are readonly.

The reasoning behind this architectural decision isn't necessarily because it is more efficient, rather it's just not necessary in Lucia's use case.

## Design Principles

The Lucia' core is designed to accomplish a balance between being **fast and compact**, by trying to execute as **few DOM operations** as it can. It achieves this by relying on directives created by the user.

- **Avoid doing unnecessary work**

  Lucia only compiles the AST with only dynamic nodes, with static nodes being garbage collected. Lucia also optimizes the AST by making directives, dependencies, and the state's size immutable. This allows for straightforward dependency tracking and thereby making the least amount of DOM operations possible.

- **Balance mutability while enforcing simple patterns**

  Many patterns in other libraries, such as the mutability of the view are often expensive on performance. Lucia attempts to resolve this through immutable directives (and thereby dependencies), allowing flexibility for the user while maintaining good performance. This way the runtime renderer does not need to check depedencies, interpretation, etc. every render cycle.

- **Keep the core as lightweight as possible**

  The goal of Lucia is to be as light as possible, meaning that to achieve this, less code needs to be written. The core should be as fundemental and simple as possible, with abstractions filling in the additional functionality.

## Overview

<p align="center"><img src="https://raw.githubusercontent.com/aidenybai/lucia/master/.github/img/flowchart.svg" alt="Diagram of build pipeline" width="752"></p>

Lucia's Core is composed of two phases: compilation and runtime.

### Compiler

The compiler's purpose is to generate an AST for the renderer to reference. It first fetches all of the nodes under the specified node, inclusive of its root, then flattening it into an array. After that, it systematically picks out dynamic nodes through two conditions:

1. Has directives `(STATIC)`
2. Has dependencies in directives `(DYNAMIC)`

Passing these two conditions will result in the creation of the AST.

**Abstract Syntax Tree**

The AST is an array of ASTNodes. An ASTNode looks like this:

```ts
interface ASTNode {
  directives: {...};
  deps: string[];
  el: HTMLElement;
  type: 0 | 1;
}
```

The `directives` property is used to data that includes reusuable functions of the directives on the specific element. We will talk more about this later. The `deps` property contains an array of dependency keys of all the directives of the element. The `el` property contains the element for the renderer to use. The `type` property can only be `0 (STATIC)` or `1 (DYNAMIC)`. This is important as the renderer garbage collects static nodes, which do not contain any dependencies.

**Directives and DirectiveData**

The values of the `directives` object are `DirectiveData`, which contain properties that the renderer can use. This is what it looks like:

```ts
interface DirectiveData {
  compute: (state: UnknownKV, event?: Event) => any;
  value: string;
  deps: string[];
}
```

The `compute` function interprets and evaluates the `value`, passing the state from `compute`'s state parameter. Notice how there is a duplicate `deps` property for the `DirectiveData`. This functionally is the same as the ASTNode `deps`, but is for more fine tuned for dependency tracking. This pertains only to its own directive, while the ASTNode `deps` pertains to all of the directives.

**Performance Decisions**

The compiler intentionally handles a lot of the decision-making, such as dependency-tracking and only using dynamic nodes. These actions allow for better performace at runtime, but requires immutability. This makes Lucia less flexible, but it is possible to achieve the same goal with different patterns.

### Renderer

The renderer's purpose is to change the DOM based on the state. It does this by iterating over the AST from the compiler, checking dependencies against changed dependencies supplied by the observer, and rendering directives if necessary.

**Garbage Collection**

There are two types of ASTNodes as designated by the compiler: `0 (STATIC)` and `1 (DYNAMIC)`. Static ASTNodes refer to ASTNodes with directives, but no dependencies. Since directives are immutable, these nodes only need to be rendered once. After they are rendered, they are pushed to a queue. After all affected ASTNodes are rendered, they are deleted from the AST. This means that unnecessary iteration is removed, boosting performance.

**Expression Computation and Interpretation**

Since directives are special attributes, the value of directives are strings. Lucia first attempts to determine the exact dependency, so it can just access by state property. It currently supports direct key (`prop`), function calling (`prop()`), and access by index (`prop[i]`). If it is not able to interpret the properties from the directive value, it will use the [`new Function()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) syntax to execute.

### Observer

The observer's purpose is to detect changes in the state and run a callback render function on change. This is useful because we only want to render if the state changes, as the content of the DOM is directly connected to the state.

To do this, a JavaScript object is provided, [sealed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal), and wrapped with a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). This allows the `get` and `set` traps to be set. The observer automatically attempts to proxify nested arrays and objects, so that callback renders are able to be handled on change.

**Special Cases**

Some cases, such as array mutations using methods, such as `push` and `pop`, Proxy's are updated two times. The first change is a change in value, then in length. This can vary in order or in presense based on the type of mutation, meaning that both traps need to be accountd for. This means it renders both times, which is a minor performance bottleneck.

Another peculiarity of Proxy's is that changed information (`target`, `key`, `value`) are based on the current object, not the root object. This means that if there is a nested object in the state, the target will not be the root node, messing up our dependencies. What the observer currently does is go to root and attempt to find the affected object that contains the dependencies.

Lastly, methods are immutable. This is because there is dependency-tracking during compilation on the stringified content of methods.
