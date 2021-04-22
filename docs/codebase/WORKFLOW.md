## Workflow Documentation

Lucia is written in [TypeScript](https://www.typescriptlang.org) and should be run in a browser environment. We highly recommend you use [VSCode](https://code.visualstudio.com/) as your IDE when developing.

### Yarn Scripts

- `dev` - This script builds the codebase and watches for changes into a `iife` distribution bundle using [esbuild](http://esbuild.github.io/)
- `build` - This script builds the codebase into a `iife`, `cjs`, and `esm` format distribution bundles using [Rollup](https://rollupjs.org/)
- `lint` - This script uses [ESLint](https://eslint.org/) to lint the codebase
- `lint:fix` - This script uses [ESLint](https://eslint.org/) to lint the codebase and attempts to fix any errors
- `cleanup` - This script uses [Prettier](https://prettier.io/) to format the codebase
- `test` - This script runs unit tests (specified under `__test__` folders) using [Jest](https://jestjs.io/)
- `release` - This script runs the aformentioned scripts and publishes the project on NPM

### Iterating

You can create a `*.html` (e.g. `test.html`) file at root to test changes in realtime. We recommend using `live-server` to hot-reload the webpage on change, and edit as necessary.

Below is a sample for a Lucia starter:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="./dist/lucia.dev.js"></script>
  </head>
  <body>
    <!-- Your code here -->
  </body>
</html>
```