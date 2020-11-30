# <a href="http://lucia.js.org"><img src="https://raw.githubusercontent.com/aidenybai/lucia/master/.github/img/logo.svg" height="60" alt="Lucia Logo" aria-label="http://lucia.js.org" /></a>

A tiny `3kb` JavaScript library for prototyping web applications.

- **Declarative:** Lucia provides a declarative API similar to Vue to create views, making development predictable and intuitive through markup-centric code.
- **Reactive:** When the view is changed and trapped by the observer, the internal Virtual DOM will automatically react and will update and render the new view in realtime.
- **Lightweight:** Lucia is extremely light and performant as it renders directives only if necessary by skipping static nodes through element references.

![TravisCI Build](https://badgen.net/travis/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square&label=build) ![Code Size](https://badgen.net/badgesize/brotli/https/unpkg.com/lucia?color=7460E1&labelColor=1D1E32&style=flat-square&label=size) ![NPM Version](https://img.shields.io/npm/v/lucia?color=7460E1&labelColor=1D1E32&style=flat-square) ![Code Coverage](https://img.shields.io/coveralls/github/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square)

[**→ Check out the Lucia Website**](https://lucia.js.org)

## 📩 Installation

Lucia is currently is installable through a CDN and also supports UMD (ES Module, CommonJS, IIFE). Put this within your `<head>` tags in HTML.

```html
<script src="https://unpkg.com/lucia"></script>
```

If you are using a module bunder like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org):

```sh
npm install lucia
```

[**→ Learn more about installing Lucia**](https://lucia.js.org/docs/essentials/installation)

## 📕 Documentation

The Lucia docs are located at [**https://lucia.js.org**](https://lucia.js.org):

- [Introduction](https://lucia.js.org/docs/essentials/introduction)
- [Installation](https://lucia.js.org/docs/essentials/installation)
- [Clicker Game Example](https://lucia.js.org/docs/essentials/introduction#clicker-game-example)

[**→ Learn how the Lucia Virtual DOM works**](https://github.com/aidenybai/lucia/tree/master/src/vdom#readme)

## 📺 Example

Below is an example of a clicker game in Lucia. No, your eyes aren't fooling you - it's really that simple.

```html
<div l-init="{ count: 0 }">
  <button l-text="this.count" l-on:click="++this.count">0</button>
</div>
```

[**→ View the live Codepen example**](https://codepen.io/aidenybai/pen/jOrXdKj)

## 👍 Similar Projects

It should be noted that Lucia should not be implemented in all use cases. Lucia aims to tackle projects that need to be quickly implemented. This means if you're looking for something production-ready and has a API similar to Lucia, check these projects out!

- [Vue](https://github.com/vuejs/vue) - A progressive, incrementally-adoptable JavaScript framework for building UI on the web.
- [Alpine](https://github.com/alpinejs/alpine) - A rugged, minimal framework for composing JavaScript behavior in your markup.
- [Remake](https://github.com/remake/remake-cli) - Create interactive web apps with just HTML.
- [Stimulus](https://github.com/stimulusjs/stimulus) - A modest JavaScript framework for the HTML you already have.
- [Mavo](https://github.com/mavoweb/mavo) - Create web applications entirely by writing HTML and CSS!

## 🧑‍🤝‍🧑 Contributing

Refer to the [CONTRIBUTING.md](https://github.com/aidenybai/lucia/blob/master/.github/CONTRIBUTING.md) file for instructions. Below are some of the projects under `lucialand`:

- [Luciascript](https://github.com/lucialand/luciascript) - Hastscript like utility to create HTML strings
- [Luciex](https://github.com/lucialand/luciex) - Simplistic state management

<a href="https://github.com/aidenybai/lucia/graphs/contributors"><img src="https://opencollective.com/lucialand/contributors.svg?width=890" /></a>

## 📑 License

Lucia is [MIT licensed](LICENSE.md).

＼＿ﾍ(◕‿◕ ✰)
