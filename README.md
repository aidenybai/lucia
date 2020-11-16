[![Lucia](https://raw.githubusercontent.com/aidenybai/lucia/master/.github/img/banner.svg)](https://lucia.js.org)

![TravisCI Build](https://badgen.net/travis/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square&label=build) ![Code Size](https://badgen.net/badgesize/brotli/https/unpkg.com/lucia?color=7460E1&labelColor=1D1E32&style=flat-square&label=size) ![NPM Version](https://img.shields.io/npm/v/lucia?color=7460E1&labelColor=1D1E32&style=flat-square) ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?color=7460E1&labelColor=1D1E32&style=flat-square) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?color=7460E1&labelColor=1D1E32&style=flat-square) ![Code Coverage](https://img.shields.io/coveralls/github/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square)

## What is Lucia?

Lucia is a tiny JavaScript (UMD compatible) library that serves as a bridge between vanilla JavaScript and Vue. Some features of Lucia are:

- **Declarative:** Lucia provides a declarative API similar to Vue/Alpine to create views, making development predictable and intuitive through markup-centric code.
- **Reactive:** When the view is changed, the internal reference Virtual DOM will automatically react and will update and render the new view in realtime.
- **Lightweight:** Lucia is extremely light (~3kb min+brotli) and performant as it does not use a traditional Virtual DOM, rather it renders directives only if necessary by skipping static nodes through selectors.

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

Another option is installing via if you are using a module bundler such as [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org).

```sh
$ npm install lucia
```

## Example

Below is an example of a clicker game in Lucia. No, your eyes aren't fooling you - it's really that simple.

```html
<div l-init="{ count: 0 }">
  <button l-text="count" l-on:click="++count">0</button>
</div>
```

View the [live example here](https://codepen.io/aidenybai/pen/jOrXdKj)

## Documentation

If you're interested in learning more about Lucia, visit [the documentation](https://lucia.js.org).

## Similar Projects

If you're looking for something production-ready and is widely that has a API similar to Lucia, check these projects out!

- [Alpine](https://github.com/alpinejs/alpine) - A rugged, minimal framework for composing JavaScript behavior in your markup.
- [Stimulus](https://github.com/stimulusjs/stimulus) - A modest JavaScript framework for the HTML you already have.
- [Remake](https://github.com/remake/remake-cli) - Create interactive web apps with just HTML.
- [Intercooler.js](https://github.com/intercoolerjs/intercooler-js) - Making AJAX as easy as anchor tags.
- [Mavo](https://github.com/mavoweb/mavo) - Create web applications entirely by writing HTML and CSS!
- [Htmx](https://github.com/bigskysoftware/htmx) - </> htmx - high power tools for HTML.
- [Unpoly](https://github.com/unpoly/unpoly) - Unobtrusive Javascript Framework for server-side applications.

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
