# <a href="https://lucia.js.org"><img src="https://raw.githubusercontent.com/aidenybai/lucia/master/.github/img/logo.svg" height="60" alt="Lucia的标识" aria-label="https://lucia.js.org" /></a>

### 3kb小型网站的程序

无需任何样板文件，捆绑程序或复杂的构建过程。Lucia旨在做到这一点，为您的逻辑提供一个增强层，使您能够以最少的精力和时间来构建所需的内容。

![TravisCI Build](https://badgen.net/travis/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square&label=build) ![Code Size](https://badgen.net/badgesize/brotli/https/unpkg.com/lucia?color=7460E1&labelColor=1D1E32&style=flat-square&label=size) ![NPM Version](https://img.shields.io/npm/v/lucia?color=7460E1&labelColor=1D1E32&style=flat-square) ![Code Coverage](https://img.shields.io/coveralls/github/aidenybai/lucia?color=7460E1&labelColor=1D1E32&style=flat-square)

[**→ 前往Lucia网站**](https://lucia.js.org)

## 安装

Lucia默认不需要构建工具，请放下一个[script标签](https://lucia.js.org/docs/fundementals/installation/#cdn)在网页的顶部。

```html
<script src="https://unpkg.com/lucia"></script>
```

它还与模块捆绑器例如[Webpack](https://webpack.js.org/)或者[Rollup](https://rollupjs.org/)，我们建议[指定确切的版本](https://lucia.js.org/docs/fundementals/installation/#npm)如果您以这种方式导入Lucia。

[**→ 了解有关安装Lucia的更多信息**](https://lucia.js.org/docs/fundementals/installation)

## Todo App示例

以下是使用Lucia，零JavaScript的todo应用程序的极其简单的实现。可以通过提交带有输入的表单来添加任务。不，你的眼睛没有骗你-真的很简单。

```html
<div l-state="{ value: '', todo: [] }">
  <!-- 双向绑定 `value` 物有所值 -->
  <input l-model="value" />
  <!-- 捕获点击事件，推动当前 `value` 到 `todo` -->
  <button @click="todo.push(value)">创造</button>
  <!-- 将数组连接在一起 -->
  <ul l-for="task in todo">
    <li l-text="this.task"></li>
  </ul>
</div>
```

[**→ 查看实时Codepen示例**](https://codepen.io/aidenybai/pen/JjRrwjN)

## 赞助商

<a href="https://anomaly-science.com/" target="_blank"><img width="20%" src="https://raw.githubusercontent.com/Anomaly-Science/assets/main/SVG/Anomaly%20Science%20Logo%20Full%20Light%20Mode.svg" alt="Anomaly Science"></a>

**在这里想要您的徽标？ [→ 赞助者卢西亚](https://github.com/sponsors/aidenybai)**

## 资源与贡献

寻找文件？ 检查 [Lucia网站](https://lucia.js.org)。

想了解Lucia吗？ 加入[Lucia Discord](https://discord.gg/q2pSU39)并向社区寻求帮助。

发现错误？ 前往我们的[问题追踪器](https://github.com/aidenybai/lucia/issues)我们将尽力提供帮助。我们也喜欢请求请求。

我们希望所有Lucia贡献者都遵守我们的条款[行为守则](https://github.com/aidenybai/lucia/blob/master/.github/CODE_OF_CONDUCT.md)。

[**→ 开始在Github上做贡献**](https://github.com/aidenybai/lucia/blob/master/.github/CONTRIBUTING.md)

## 致谢

Lucia是[麻省理工学院许可的](LICENSE.md) 开源软件[Aiden Bai](https://github.com/aidenybai) [等等。](https://github.com/aidenybai/lucia/graphs/contributors)

Lucia的灵感来自[Vue的句法](https://github.com/vuejs/vue)，并相信背后的核心哲学和价值观[Alpine](https://github.com/alpinejs/alpine)，[Sidewind](https://github.com/survivejs/sidewind)，和[Remake](https://github.com/remake/remake-cli)。如果您对可用于生产环境的库感兴趣，请随时将其签出。

---

©2020年至今Lucia作者。
