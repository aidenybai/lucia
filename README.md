# <a href="http://lucia.js.org"><img src="https://raw.githubusercontent.com/aidenybai/lucia/master/.github/img/logo.svg" height="60" alt="Lucia Logo" aria-label="http://lucia.js.org" /></a>

Lucia is a tiny JavaScript library for building web apps.

- **Declarative:** Lucia provides a declarative API similar to Vue/Alpine to create views, making development predictable and intuitive through markup-centric code.
- **Reactive:** When the view is changed, the internal reference Virtual DOM will automatically react and will update and render the new view in realtime.
- **Lightweight:** Lucia is extremely light and performant as it does not use a traditional Virtual DOM, rather it renders directives only if necessary by skipping static nodes through selectors.

![TravisCI Build](https://badgen.net/travis/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square&label=build) ![Code Size](https://badgen.net/badgesize/brotli/https/unpkg.com/lucia?color=7460E1&labelColor=1D1E32&style=flat-square&label=size) ![NPM Version](https://img.shields.io/npm/v/lucia?color=7460E1&labelColor=1D1E32&style=flat-square) ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?color=7460E1&labelColor=1D1E32&style=flat-square) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?color=7460E1&labelColor=1D1E32&style=flat-square) ![Code Coverage](https://img.shields.io/coveralls/github/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square)

## Installation

Lucia is currently is installable through a CDN and also supports UMD (ES Module, CommonJS, IIFE). Put this within your `<head>` tags in HTML.

```html
<script src="https://unpkg.com/lucia"></script>
```

If you are using a module bunder like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org):

```sh
npm install lucia
```

For more details, see the [Installation docs page](https://lucia.js.org/docs/essentials/installation).

## Documentation

The Lucia docs are located at [**https://lucia.js.org**](https://lucia.js.org):

- [Introduction](https://lucia.js.org/docs/essentials/introduction)
- [Installation](https://lucia.js.org/docs/essentials/installation)
- [Clicker Game Example](https://lucia.js.org/docs/essentials/introduction#clicker-game-example)

## Example

Below is an example of a clicker game in Lucia. No, your eyes aren't fooling you - it's really that simple.

```html
<div l-init="{ count: 0 }">
  <button l-text="count" l-on:click="++count">0</button>
</div>
```

View the [live example here](https://codepen.io/aidenybai/pen/jOrXdKj)

## Similar Projects

It should be noted that Lucia should not be implemented in all use cases. Lucia aims to tackle projects that need to be quickly implemented. This means if you're looking for something production-ready and has a API similar to Lucia, check these projects out!

- [Vue](https://github.com/vuejs/vue) - Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.
- [Alpine](https://github.com/alpinejs/alpine) - A rugged, minimal framework for composing JavaScript behavior in your markup.
- [Remake](https://github.com/remake/remake-cli) - Create interactive web apps with just HTML.
- [Stimulus](https://github.com/stimulusjs/stimulus) - A modest JavaScript framework for the HTML you already have.
- [Mavo](https://github.com/mavoweb/mavo) - Create web applications entirely by writing HTML and CSS!

## Contributing

Refer to the [CONTRIBUTING.md](https://github.com/aidenybai/lucia/blob/master/.github/CONTRIBUTING.md) file for instructions.

<a href="https://github.com/aidenybai/lucia/graphs/contributors"><img src="https://opencollective.com/lucialand/contributors.svg?width=890" /></a>

## License

Lucia is [MIT licensed](LICENSE.md).

＼＿ﾍ(◕‿◕ ✰)
