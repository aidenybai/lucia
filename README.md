> The Lucia.js project is no longer maintained or usable, this repository serves as an archive for the source code. If you used Lucia.js, thank you for trying our the library in your projects. I hope this repository serves as a useful learning tool for others in the future.
> Note that the `lucia` NPM package name has been transfered to the [`lucia-auth`](https://lucia-auth.com/) project.

# <a href="https://lucia.js.org"><img src="https://raw.githubusercontent.com/aidenybai/lucia/master/.github/img/logo.svg" height="60" alt="Lucia Logo" aria-label="Lucia Logo" /></a>

### 3kb library for tiny web apps.

Sometimes, all you want to do is to try and do something—no boilerplate, bundlers, or complex build processes. Lucia aims to provide an augmentation layer for your logic, allowing you to bind attributes to your HTML to add interactivity without writing any extra JavaScript.

[![CI](https://img.shields.io/github/workflow/status/aidenybai/lucia/CI?color=7460E1&labelColor=1D1E32&style=flat-square&label=build)](https://img.shields.io/github/workflow/status/aidenybai/lucia)
![Code Size](https://badgen.net/badgesize/brotli/https/unpkg.com/lucia/dist/lucia.min.js?color=7460E1&labelColor=1D1E32&style=flat-square&label=size) ![NPM Version](https://img.shields.io/npm/v/lucia?color=7460E1&labelColor=1D1E32&style=flat-square) ![Code Coverage](https://img.shields.io/coveralls/github/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square)

[**→ Check out the Lucia Website**](https://lucia.js.org)

> Hi! Aiden here, author of Lucia. I hope you find an interesting take on web development and a useful tool for your projects. Lucia is actively looking for new maintainers, please [leave a reply](https://github.com/aidenybai/lucia/discussions/181)!
>
> -Aiden ([@aidenybai](https://github.com/aidenybai))

## Installing Lucia

Lucia doesn't require build tools by default. Feel free to just drop a [script tag](https://lucia.js.org/docs/fundementals/installation/#cdn) in the head of your webpage.

```html
<!-- Development version: helpful console tips -->
<script src="https://unpkg.com/lucia"></script>

<!-- Production version: no warnings -->
<script src="https://unpkg.com/lucia/dist/lucia.min.js"></script>
```

It also integrates well with module bundlers like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/); we recommend [specifying the exact build](https://lucia.js.org/docs/fundementals/installation/#npm) if you import Lucia this way.

[**→ Learn more about installing Lucia**](https://lucia.js.org/docs/fundementals/installation)

## Todo App Example

Below is an extremely simple implementation of a todo app using Lucia, utilizing zero JavaScript. Tasks can be added by submitting the form with the input. No, your eyes aren't fooling you—it's really that simple.

```html
<div l-state="{ value: '', todo: [] }">
  <!-- oninput: set `value` to input.value -->
  <input l-model="value" />
  <!-- onclick: add the current `value` to the `todo` array -->
  <button @click="todo.push(value)">Create</button>
  <!-- joins `todo` array together -->
  <ul l-for="task in todo">
    <li l-text="this.task"></li>
  </ul>
</div>
```

[**→ View the live Codepen example**](https://codepen.io/aidenybai/pen/JjRrwjN)

## Sponsors

<a href="https://hackclub.com/bank" target="_blank"><img height="60" src="https://cdn.glitch.com/747f5921-6fdc-45db-8eaa-ac12523e0e6c%2Fhackclub-bank.svg?v=1566159701206" alt="Hack Club Bank"></a>

**Want your logo here? [→ Sponsor Lucia](https://bank.hackclub.com/donations/start/lucia)**

## Resources & Contributing Back

Looking for the docs? Check the [Lucia website](https://lucia.js.org) out.

Have a question about Lucia? Post it on the [GitHub Discussions](https://github.com/aidenybai/lucia/discussions) and ask the community for help.

Find a bug? Head over to our [issue tracker](https://github.com/aidenybai/lucia/issues) and we'll do our best to help. We love pull requests, too!

We expect all Lucia contributors to abide by the terms of our [Code of Conduct](https://github.com/aidenybai/lucia/blob/master/.github/CODE_OF_CONDUCT.md).

[**→ Start contributing on GitHub**](https://github.com/aidenybai/lucia/wiki)

## Acknowledgments

Lucia is [MIT-licensed](LICENSE) open-source software by [Aiden Bai](https://github.com/aidenybai) [et al.](https://github.com/aidenybai/lucia/graphs/contributors)

Lucia takes heavy inspiration from [Vue's syntax](https://github.com/vuejs/vue), and believes in the core philosophies and values behind [Alpine.js](https://github.com/alpinejs/alpine), [Dababy](https://github.com/aidenybai/dababy), and [Remake](https://github.com/remake/remake-cli). Feel free to check them out if you interested in an alternative library to use.

_Lucia originates from the Latin word "lux", meaning "light, illuminance"_

---

© 2020-2021 Aiden Bai.
