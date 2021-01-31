### Table of Contents

- [Internal Documentation](#internal-documentation)
  - [Design principles](#design-principles)
- [Overview](#overview)
  - [Compiler](#compiler)
  - [Renderer](#renderer)
  - [Watcher](#watcher)

# Internal Documentation

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

![Flowchart Overview](https://chart.googleapis.com/chart?cht=gv:circo&chl=digraph{DOM->Compiler->Watcher->Renderer->Directive->Watcher})

### Compiler

TODO

### Renderer

TODO

### Watcher

TODO
