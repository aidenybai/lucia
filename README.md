<img src="https://github.com/luciadotjs/lucia/raw/master/.github/img/logo.svg" width="80px" align="right" />

# [Lucia](https://lucia.js.org) &middot; ![Code Size](https://badgen.net/badgesize/brotli/https/unpkg.com/lucia?color=7460E1&style=flat-square) ![NPM Version](https://img.shields.io/npm/v/lucia?color=%23C454FF&style=flat-square) ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?color=%23E676AA&style=flat-square) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?color=%23FA8A7C&style=flat-square)

> Currently in heavy development (learning project w/ breaking changes) and can have possible unintented consequences. Do not use in production.

Lucia is a tiny JavaScript library for web applications.

Torvalds was here nice to meet you

- **Declarative:** Lucia makes it painless to create interactive UIs. Declarative views make your code more predictable, simpler to understand, and easier to debug.
- **Reactive:** When a data point is changed, the loose Virtual DOM will react and will update and render the points in realtime.
- **Data-Driven:** Instead of using traditional direct DOM manipulation, Lucia provides an interface to change data to mutate our loose Virtual DOM.

## Installation

Put this within your `<head>` tags in html.

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
  <button *on:click="increment()">{{ count }}</button>
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

At the core of Lucia is a system that enables us to declaratively render data to the DOM using straightforward template syntax:

```html
<div id="app">
  <p>{{ message }}</p>
  <p>{{ message === 'Hello World!' }}</p>
</div>
```

```js
Lucia.createApp({
  message: 'Hello World!',
}).mount('#app');
```

You can also use the `*html` directive for more advanced content manipulation.

```html
<div id="app">
  <p *html="message"></p>
</div>
```

```js
Lucia.createApp({
  message: '<button>Hello World!</button>',
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
  <button *on:click="announce()">{{ message }}</button>
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

In addition to text interpolation, we can also bind element attributes like this:

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

We can use the `*join` directive to render a list of items based on an array.

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

You can use the `*model` directive to create two-way data bindings on form input, textarea, and select elements.

```html
<div id="app">
  <input *model="message" />
  {{ message }}
</div>
```

```js
Lucia.createApp({
  message: 'Nothing submitted yet',
}).mount('#app');
```

### Mounted Callback

You can apply the callback to the mount method to read data values.

```html
<div id="app">
  <h1>{{ message }}</h1>
</div>
```

```js
Lucia.createApp({
  message: 'Hello World',
}).mount('#app', ({ message }) => {
  console.log(message); // => 'Hello World'
});
```

## License

Lucia is [MIT licensed](LICENSE.md).
