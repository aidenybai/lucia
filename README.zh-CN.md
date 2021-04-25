# <a href="https://lucia.js.org"><img src="https://raw.githubusercontent.com/aidenybai/lucia/master/.github/img/logo.svg" height="60" alt="Lucia Logo" aria-label="Lucia Logo" /></a>

### 用于小型Web应用程序的3kb库。

有时，您要做的就是尝试做某事-没有样板，捆绑程序或复杂的构建过程。 Lucia的目标是为逻辑提供一个扩展层，使您可以将属性绑定到HTML以增加交互性，而无需编写任何其他JavaScript。

[![CI](https://img.shields.io/github/workflow/status/aidenybai/lucia/test-runner?color=7460E1&labelColor=1D1E32&style=flat-square&label=build)](https://img.shields.io/github/workflow/status/aidenybai/lucia)![Code Size](https://badgen.net/badgesize/brotli/https/unpkg.com/lucia?color=7460E1&labelColor=1D1E32&style=flat-square&label=size)![NPM Version](https://img.shields.io/npm/v/lucia?color=7460E1&labelColor=1D1E32&style=flat-square)![Code Coverage](https://img.shields.io/coveralls/github/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square)

[**→请访问Lucia网站**](https://lucia.js.org)

## 安装Lucia

Lucia默认不需要构建工具，请放下一个[脚本标签](https://lucia.js.org/docs/fundementals/installation/#cdn)在网页的顶部。

```html
<script src="https://unpkg.com/lucia"></script>
```

它还与模块捆绑器（例如，[Webpack](https://webpack.js.org/)或者[卷起](https://rollupjs.org/)， 我们推荐[指定确切的版本](https://lucia.js.org/docs/fundementals/installation/#npm)如果您以这种方式导入Lucia。

[**→了解有关安装Lucia的更多信息**](https://lucia.js.org/docs/fundementals/installation)

## 所有应用示例

以下是使用Lucia，零JavaScript的todo应用程序的极其简单的实现。可以通过提交带有输入的表单来添加任务。不，你的眼睛没有骗你-真的很简单。

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

[**→查看实时Codepen示例**](https://codepen.io/aidenybai/pen/JjRrwjN)

## 赞助商

<a href="https://hackclub.com/bank" target="_blank"><img height="60" src="https://cdn.glitch.com/747f5921-6fdc-45db-8eaa-ac12523e0e6c%2Fhackclub-bank.svg?v=1566159701206" alt="Hack Club Bank"></a>

**在这里想要您的徽标？[→赞助卢西亚](https://bank.hackclub.com/donations/start/lucia)**

## 资源与贡献

寻找文件？检查[Lucia网站](https://lucia.js.org)出去。

想了解露西亚（Lucia）吗？张贴在[GitHub讨论](https://github.com/aidenybai/lucia/discussions)并向社区寻求帮助。

发现错误？前往我们的[问题追踪器](https://github.com/aidenybai/lucia/issues)我们将尽力提供帮助。我们也喜欢请求请求！

我们希望所有Lucia贡献者都遵守我们的条款[行为守则](https://github.com/aidenybai/lucia/blob/master/docs/guidelines/CODE_OF_CONDUCT.md).

[**→开始在GitHub上做贡献**](https://aidenybai.github.io/lucia/)

## 致谢

露西娅是[麻省理工学院许可](LICENSE)开源软件[AI的NB埃](https://github.com/aidenybai)[等。](https://github.com/aidenybai/lucia/graphs/contributors)

露西亚（Lucia）的灵感来自[Vue's syntax](https://github.com/vuejs/vue)，并坚信背后的核心哲学和价值观[Alpine.js](https://github.com/alpinejs/alpine),[达巴比](https://github.com/aidenybai/dababy)， 和[重制](https://github.com/remake/remake-cli)。如果您对使用其他库感兴趣，请随时检查。

_Lucia源自拉丁文“ lux”，意思是“光，照度”_

* * *

©2020年至今The Hack Foundation。
