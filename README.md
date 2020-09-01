<img src=".github/img/logo.svg" width="80px" align="right" />

# Lucia

> Currently in heavy development. Do not use in production

Tiny javascript library for web applications.

## Install

Put this within your `<head>` tags in html.

```html
<!-- development version, includes helpful console warnings -->
<script src="https://unpkg.com/lucia/dist/lucia.js"></script>
```

```html
<!-- production version, optimized for size and speed -->
<script src="https://unpkg.com/lucia"></script>
```

## Usage

### Declarative Rendering

At the core of Lucia is a system that enables us to declaratively render data to the DOM using straightforward template syntax:

```html
<div id="app">
  <p>{{ hello }}</p>
  <p>{{ hello === 'world' }}</p>
</div>
```

```js
const lucia = new Lucia({
  el: '#app',
  data: {
    hello: 'world',
  },
});

// Change data
lucia.$data.hello = 'there';
```

### Conditionals

It’s easy to toggle the presence of an element, too:

```html
<div id="app">
  <button l-if="show">You can't see me</button>
  <button l-if="show === show">Is it equal though?</button>
</div>
```

```js
const lucia = new Lucia({
  el: '#app',
  data: {
    show: false,
  },
});
```

### Event Handlers

To let users interact with your app, we can use the `l-on` directive to attach event listeners that invoke methods on our Lucia instances:

```html
<div id="app">
  <button l-on:click="alert(message)">{{ message }}</button>
</div>
```

```js
const lucia = new Lucia({
  el: '#app',
  data: {
    message: 'Hello world!',
  },
});
```

### Attribute Binding

In addition to text interpolation, we can also bind element attributes like this:

```html
<div id="app">
  <h1 l-bind:class="{ hello: show }">Classes are cool</h1>
  <h1 l-bind:style="color">Styles are sassy</h1>
</div>
```

```js
const lucia = new Lucia({
  el: '#app',
  data: {
    show: true,
    // You can also reference data vs inputing an object in the directive itself
    color: { color: 'purple' }, 
  },
});
```
