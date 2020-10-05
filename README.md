![Lucia](https://raw.githubusercontent.com/aidenybai/lucia/master/.github/img/banner.svg)

![Code Size](https://badgen.net/badgesize/brotli/https/unpkg.com/lucia?color=7460E1&labelColor=1D1E32&style=flat-square) ![NPM Version](https://img.shields.io/npm/v/lucia?color=7460E1&labelColor=1D1E32&style=flat-square) ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?color=7460E1&labelColor=1D1E32&style=flat-square) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?color=7460E1&labelColor=1D1E32&style=flat-square)

## What is Lucia?

Lucia is a tiny JavaScript (TypeScript compatible) library for small SPAs and web apps with a API similar to Vue. Some features of Lucia are:

- **Declarative:** Lucia provides a straightforward API to create declarative views, allowing predictible and easy development.
- **Reactive:** When the view is changed, the Virtual DOM will automatically react and will update and render the new view in realtime.
- **Lightweight:** Lucia is extremely light (~3kb min+brotli) and performant as it does not VNode diff, renders directives only if necessary by skipping static notes, and relies only on selectors.

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

Below is an example of a clicker game in Lucia.

```html
<div id="app">
  <button *on:click="increment()" *html="count"></button>
</div>
```

```js
const ClickerGame = {
  count: localStorage.count || 0,
  increment() {
    localStorage.count = ++this.count;
  },
};

Lucia.createApp(ClickerGame).mount('#app');
```

## Features

### Declarative Rendering

At the core of Lucia is a system that enables us to declaratively render data to the DOM using the straightforward `*html` directive:

```html
<div id="app">
  <p *html="message"></p>
  <p *html="message === 'Hello World!'"></p>
</div>
```

```js
Lucia.createApp({
  message: 'Hello World!',
}).mount('#app');
```

### Conditionals

It’s easy to toggle the presence of an element, too:

```html
<div id="app">
  <button *if="!show">You can't see me</button>
  <button *if="show">You can see me</button>
</div>
```

```js
Lucia.createApp({
  show: true,
}).mount('#app');
```

### Event Handlers

To let users interact with your app, we can use the `*on` directive to attach event listeners that invoke methods on our Lucia instances:

```html
<div id="app">
  <button *on:click="announce()" *html="message"></button>
</div>
```

```js
Lucia.createApp({
  message: 'Hello world!',
  announce() {
    alert(this.message);
  },
}).mount('#app');
```

### Attribute Binding

In addition to text interpolation, we can also bind element attributes using the `*bind` directive:

```html
<div id="app">
  <h1 *bind:class="{ hello: show }">Classes are cool</h1>
  <h1 *bind:style="color">Styles are sassy</h1>
</div>
```

```js
Lucia.createApp({
  show: true,
  // You can also reference data vs inputing an object in the directive itself
  color: { color: 'purple' },
}).mount('#app');
```

### List Rendering

We can also use the `*join` directive to render a list of items based on an array. Note that performance will be affected if using array mutators.

```html
<div id="app">
  <p *join="fruits by , "></p>
</div>
```

```js
Lucia.createApp({
  fruits: ['apple', 'orange', 'banana'],
}).mount('#app');
```

### Form Input Bindings

You can use the `*model` directive to create two-way data bindings on form `input`, `textarea`, and `select` elements.

```html
<div id="app">
  <input *model="message" />
  <p *html="message"></p>
</div>
```

```js
Lucia.createApp({
  message: 'Nothing submitted yet',
}).mount('#app');
```

## License

Lucia is [MIT licensed](LICENSE.md).
