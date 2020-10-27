[![Lucia](https://raw.githubusercontent.com/aidenybai/lucia/master/.github/img/banner.svg)](https://lucia.js.org)

![TravisCI Build](https://badgen.net/travis/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square) ![Code Size](https://badgen.net/badgesize/brotli/https/unpkg.com/lucia?color=7460E1&labelColor=1D1E32&style=flat-square) ![NPM Version](https://img.shields.io/npm/v/lucia?color=7460E1&labelColor=1D1E32&style=flat-square) ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?color=7460E1&labelColor=1D1E32&style=flat-square) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?color=7460E1&labelColor=1D1E32&style=flat-square)

## What is Lucia?

Lucia is a tiny JavaScript (UMD compatible) library that serves as a bridge between vanilla JavaScript and Vue. Some features of Lucia are:

- **Declarative:** Lucia provides a declarative API similar to Vue/Alpine to create views, making development predictable and intuitive through markup-centric code.
- **Reactive:** When the view is changed, the internal reference Virtual DOM will automatically react and will update and render the new view in realtime.
- **Lightweight:** Lucia is extremely light (~4kb min+brotli) and performant as it does not use a traditional Virtual DOM, rather it renders directives only if necessary by skipping static nodes through selectors.

> Right off the bat it should be noted that Lucia should not be implemented in all use cases. Lucia aims to tackle projects that need to be quickly implemented as an experiment, and this by extension doesn't make it very good for production environments. If you are looking for something established and widely used with a similar API to Lucia, check out the [similar projects](#Similar-Projects).

## Installation

Lucia is currently is installable through a CDN and also supports UMD (Node, Browser, Isomorphic/Universal). Put this within your `<head>` tags in html.

```html
<!-- development version, includes helpful console warnings -->
<script src="https://unpkg.com/lucia/dist/lucia.js"></script>
```

```html
<!-- production version, optimized for size and speed -->
<script src="https://unpkg.com/lucia"></script>
```

## Example

Below is an example of a clicker game in Lucia. No, your eyes aren't fooling you - it's really that simple.

```html
<div l-use="{ count: 0 }">
  <button l-text="count" l-on:click="++count">0</button>
</div>
```

## Features

Lucia relies on directives in markup to perform functions:

| Directive                                 | Description                                                                             |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| [`l-use`](#Creating-a-Component)          | Declares a new component scope.                                                         |
| [`l-text`](#Declarative-Rendering)        | Works similarly to `l-bind`, but will update the `textContent` of an element.           |
| [`l-html`](#Declarative-Rendering)        | Works similarly to `l-bind`, but will update the `innerHTML` of an element.             |
| [`l-if`](#Conditionals)                   | Toggles `display: none;` on the element depending on expression (true or false).        |
| [`l-on`](#Event-Handlers)                 | Attaches an event listener to the element. Executes JavaScript expression when emitted. |
| [`l-bind`](#Attribute-Binding)            | Sets the value of an attribute to the result of a JavaScript expression.                |
| [`l-join`](#List-Rendering)               | Create new DOM nodes for each item in an array.                                         |
| [`l-model`](#Form-Input-Bindings)         | Adds "two-way data binding" to an element. Keeps input element in sync with view data.  |
| [`l-link`](#Accessing-Lucia-Applications) | Allows access of initialized Lucia applications through JavaScript                      |

### Creating a Component

Lucia allows us to create component scopes. It tells the library to initialize a new component with the following data object.

```html
<div l-use="{ message: 'Hello World' }">
  <p l-text="message"></p>
</div>
```

### Declarative Rendering

At the core of Lucia is a system that enables us to declaratively render data to the DOM using the straightforward `l-text` and `l-html` directives:

```html
<div l-use="DeclarativeRendering()">
  <p l-text="message"></p>
  <p l-html="markupMessage"></p>
</div>
```

```js
function DeclarativeRendering() {
  return {
    message: 'Hello World!',
    markupMessage: '<span>Hello World with Markup!</span>',
  };
}
```

### Conditionals

It’s easy to toggle the presence of an element, too:

```html
<div l-use="Conditionals()">
  <button l-if="!show">You can't see me</button>
  <button l-if="show">You can see me</button>
</div>
```

```js
function Conditionals() {
  return { show: true };
}
```

### Event Handlers

To let users interact with your app, we can use the `l-on` directive to attach event listeners that invoke methods on our Lucia instances:

```html
<div l-use="EventHandlers()">
  <button l-on:click="announce()" l-text="message"></button>
</div>
```

```js
function EventHandlers() {
  return {
    message: 'Hello world!',
    announce() {
      alert(this.message);
    },
  };
}
```

### Attribute Binding

In addition to text interpolation, we can also bind element attributes using the `l-bind` directive:

```html
<div l-use="AttributeBinding()">
  <h1 l-bind:class="{ hello: show }">Classes are cool</h1>
  <h1 l-bind:style="color">Styles are sassy</h1>
</div>
```

```js
function AttributeBinding() {
  return {
    show: true,
    color: { color: 'purple' },
  };
}
```

### List Rendering

We can also use the `l-join` directive to render a list of items based on an array. Note that performance will be affected if using array mutators.

```html
<div l-use="ListRendering()">
  <p l-join="fruits by , "></p>
</div>
```

```js
function ListRendering() {
  return {
    fruits: ['apple', 'orange', 'banana'],
  };
}
```

### Form Input Bindings

You can use the `l-model` directive to create two-way data bindings on form `input`, `textarea`, and `select` elements.

```html
<div l-use="FormInputBindings()">
  <input l-model="message" />
  <p l-text="message"></p>
</div>
```

```js
function FormInputBindings() {
  return {
    message: 'Nothing submitted yet',
  };
}
```

### Accessing Lucia Applications

You can use the `l-link` directive to allow access of Lucia apps through the `Lucia.links` property

```html
<div l-use="AccessingLuciaApplications()" l-link="AccessingLuciaApplications">
  <p l-text="message"></p>
</div>
```

```js
function AccessingLuciaApplications() {
  return {
    message: 'Hello World',
  };
}

console.log(Lucia.links().AccessingLuciaApplications.$view);
```

## Similar Projects

If you're looking for something production-ready and is widely that has a API similar to Lucia, check these projects out!

- [Alpine](https://github.com/alpinejs/alpine) - A rugged, minimal framework for composing JavaScript behavior in your markup.
- [Stimulus](https://github.com/stimulusjs/stimulus) - A modest JavaScript framework for the HTML you already have.
- [Intercooler.js](https://github.com/intercoolerjs/intercooler-js) - Making AJAX as easy as anchor tags.
- [Mavo](https://github.com/mavoweb/mavo) - Create web applications entirely by writing HTML and CSS!
- [Htmx](https://github.com/bigskysoftware/htmx) - </> htmx - high power tools for HTML
- [Unpoly](https://github.com/unpoly/unpoly) - Unobtrusive Javascript Framework for server-side applications

## License

Lucia is [MIT licensed](LICENSE.md).

## Acknowledgements

This project could not have been created with the inspiration from dedicated developers of the projects listed below:

- [Vue](https://github.com/vuejs/vue) for the fantastically structured API.
- [Svelte](https://github.com/sveltejs/svelte) for their dedication to performance and amazing banner header.
- [Alpine](https://github.com/alpinejs/alpine) for the component scope syntax as well as great documentation.
- [Moon](https://github.com/kbrsh/moon) for the initial itch to start a lightweight JavaScript library.

As well as the developers, awesome [contributors](https://github.com/aidenybai/lucia/graphs/contributors), and the CHS Magnet Program for providing this opportunity to me.

＼＿ﾍ(◕‿◕ ✰)
