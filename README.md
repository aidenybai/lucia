# <a href="http://lucia.js.org"><img src="https://raw.githubusercontent.com/aidenybai/lucia/master/.github/img/logo.svg" height="60" alt="Lucia Logo" aria-label="http://lucia.js.org" /></a>

### 3kb library for tiny web apps.

Sometimes, all you want to do is to try and do something—No boilerplate, bundlers, or complex build processes. Lucia aims to do this, providing an augmentation layer for your logic, allowing you to build just what you need with minimal effort and time.

![TravisCI Build](https://badgen.net/travis/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square&label=build) ![Code Size](https://badgen.net/badgesize/brotli/https/unpkg.com/lucia?color=7460E1&labelColor=1D1E32&style=flat-square&label=size) ![NPM Version](https://img.shields.io/npm/v/lucia?color=7460E1&labelColor=1D1E32&style=flat-square) ![Code Coverage](https://img.shields.io/coveralls/github/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square)

[**→ Check out the Lucia Website**](https://lucia.js.org)

## Installing Lucia

Lucia doesn't require build tools by default, feel free to just drop a [script tag](https://lucia.js.org/docs/fundementals/installation/#cdn) in the head of your webpage.

```html
<script src="https://unpkg.com/lucia"></script>
```

It also integrates well with module bundlers like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/), we recommend [specifying the exact build](https://lucia.js.org/docs/fundementals/installation/#npm) if you import Lucia this way.

[**→ Learn more about installing Lucia**](https://lucia.js.org/docs/fundementals/installation)

## Todo App Example

Below is an extremely simple implementation of a todo app using Lucia, utilizing zero JavaScript. Tasks can be added by submitting the form with the input. No, your eyes aren't fooling you - it's really that simple.

```html
<div l-state="{ value: '', todo: [] }">
  <!-- two-way-binds `value` prop to value -->
  <input l-model="value" />
  <!-- captures click event, pushing current `value` to `todo` -->
  <button @click="todo.push(value)">Create</button>
  <!-- joins array together -->
  <ul l-for="task in todo">
    <li l-text="this.task"></li>
  </ul>
</div>
```

[**→ View the live Codepen example**](https://codepen.io/aidenybai/pen/JjRrwjN)

## Resources & Contributing Back

Looking for the docs? Check the [Lucia website](https://lucia.js.org) out.

Have a question about Lucia? Join the [Lucia Discord server](https://discord.gg/q2pSU39) and ask the community for help.

Find a bug? Head over to our [issue tracker](https://github.com/aidenybai/lucia/issues) and we'll do our best to help. We love pull requests, too!

We expect all Lucia contributors to abide by the terms of our [Code of Conduct](https://github.com/aidenybai/lucia/blob/master/.github/CODE_OF_CONDUCT.md).

[**→ Start contributing on Github**](https://github.com/aidenybai/lucia/blob/master/.github/CONTRIBUTING.md)

## Acknowledgments

Lucia is [MIT-licensed](LICENSE.md) open-source software by [Aiden Bai](https://github.com/aidenybai), [et al](https://github.com/aidenybai/lucia/graphs/contributors).

Lucia takes heavy inspiration from [Vue's syntax](https://github.com/vuejs/vue), and believes in the core philosophies and values behind [Alpine](https://github.com/alpinejs/alpine), [Sidewind](https://github.com/survivejs/sidewind), and [Remake](https://github.com/remake/remake-cli). Feel free to check them out if you interested in a production-ready library to use.

[![HN Post](https://hackerbadge.now.sh/api?id=24887968&type=light)](https://news.ycombinator.com/item?id=24887968)

---

© 2020 The Lucia Authors.
