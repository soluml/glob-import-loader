[![Build Status](https://travis-ci.org/soluml/glob-import-loader.svg)](https://travis-ci.org/soluml/glob-import-loader.svg)
[![npm version](https://badge.fury.io/js/glob-import-loader.svg)](https://badge.fury.io/js/glob-import-loader)

# glob-import-loader

Webpack loader that enables ES6 imports with glob patterns. Leverages Webpack's [Enhanced Resolver](https://github.com/webpack/enhanced-resolve) to resolve aliases.

_Inspired by [webpack-import-glob-loader](https://github.com/fred104/webpack-import-glob-loader)_

## Known Issues

1. `?`, `+`, and `!` globbing characters have issues as they're currently incompatible with Enhanced Loader. Looking for workarounds!

## Notes on Sass's `@use` and `@forward`

`@use`'s configuration syntax [(`with`)](https://sass-lang.com/documentation/at-rules/use#configuration) and `@forward`'s configuration syntax [(`hide`)](https://sass-lang.com/documentation/at-rules/forward#controlling-visibility) is not supported and will be ignored. These should not be added in a wildcard fashion and should instead be set individually on each module.

---

```js
import modules from "./foo/**/*.js";
```

Expands into

```js
import * as module0 from "./foo/1.js";
import * as module1 from "./foo/bar/2.js";
import * as module2 from "./foo/bar/3.js";

var modules = [module0, module1, module2];
```

---

For importing from node module

```js
import modules from "a-node-module/**/*js";
```

Expands into

```js
import * as module0 from "a-node-module/foo/1.js";
import * as module1 from "a-node-module/foo/bar/2.js";
import * as module2 from "a-node-module/foo/bar/3.js";

var modules = [module0, module1, module2];
```

---

**For side effects:**

```js
import "./foo/**/*.scss";
```

Expands into

```js
import "./foo/1.scss";
import "./foo/bar/2.scss";
```

---

**For sass:**

```scss
@import "./foo/**/*.scss";
```

Expands into

```scss
@import "./foo/1.scss";
@import "./foo/bar/2.scss";
```

```scss
@use "./foo/**/*.scss" as *;
```

Expands into

```scss
@use "./foo/1.scss" as *;
@use "./foo/bar/2.scss" as *;
```

```scss
@forward "./foo/**/*.scss" as C;
```

Expands into

```scss
@forward "./foo/1.scss" as C0;
@forward "./foo/bar/2.scss" as C1;
```

---

## Install

```sh
npm install glob-import-loader --save-dev
```

## Usage

You can use it one of two ways, the recommended way is to use it as a preloader

```js
// ./webpack.config.js

module.exports = {
  ...
  module: {
    rules: [
      {
          test: /\.js$/,
          use: 'glob-import-loader'
      },
      {
          test: /\.scss$/,
          use: 'glob-import-loader'
      },
    ]
  }
};
```

Alternatively you can use it as a chained loader

```js
// foo/bar.js
import "./**/*.js";

// index.js
import "glob-import-loader!foo/bar.js";
```

## Options

|                     Name                      |     Type     |   Default   | Description                                                                                                                                        |
| :-------------------------------------------: | :----------: | :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------- |
|           **[`resolve`](#resolve)**           |  `{Object}`  |    `{}`     | Your Webpack resolution ([`resolve`](https://webpack.js.org/configuration/resolve/)) rules.                                                        |
|            **[`banner`](#banner)**            | `{Function}` | `undefined` | An optional function for how wildcard variables should display. Useful for things such as HMR Where names must be predictable.                     |
| **[`ignoreNodeModules`](#ignoreNodeModules)** | `{Boolean}`  |  `true`\*   | Determines whether files under `node_modules` should be ignored. By default, they are ignored unless "node_modules" is present in the glob string. |

### `resolve`

Type: `Object`
Default: `{}` (or default webpack resolution rules)

This object should reference your resolution object in your _webpack.config.js_ configuration.

Example:

**webpack.config.js**

```js
const resolve = {
  alias: {
    Sprite: path.resolve(__dirname, "src/assets/sprite"),
    CSS: path.resolve(__dirname, "src/css"),
    JS: path.resolve(__dirname, "src/js"),
  },
  modules: [path.resolve(__dirname, "node_modules")],
  extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  plugins: [new DirectoryNamedWebpackPlugin(true)],
};

module.exports = {
  target: 'web',
  resolve,
  entry: { ... }
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          'babel-loader',
          {
            loader: 'glob-import-loader',
            options: {
              resolve,
            },
          },
        ],
      },
    ],
  },
  ... other settings ...
};
```

### `banner`

Type: `Function`
Default: `undefined`

This function gives you granular control over how "import" variables are output in the code should you need it. Can be useful when needing predictable variable names, such as with HMR. The `banner` function should return serialized JavaScript. The banner function receives two arguments:

1. `paths` - An array of objects with the following structure:
   | Name | Description |
   | :-----------------------: | :----------------------------------------------------------------------------------------------------------------------------- |
   | **`path`** | The path to the imported file. |
   | **`module`** | Variable reference to the value exported by the file. |
   | **`importString`** | The import string use by Webpack to import the file |

2. `varname` - The variable name used when importing.

#### `banner` Example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [path.resolve(__dirname, "src")],
        use: [
          "babel-loader",
          {
            loader: "glob-import-loader",
            options: {
              banner(paths, varname) {
                if (varname) {
                  return `var ${varname} = {${paths
                    .map(
                      ({ path: fn, module }) => `
                      "${path.basename(fn).split(".")[0]}":${module}
                    `
                    )
                    .join(",")}};`;
                }
              },
            },
          },
        ],
      },
    ],
  },
};
```

**entry.js** (source)

```js
import cmpts from "JS/**/*.cmpt.jsx";
```

**entry.js** (output)

```
... webpack import statements ...

// output via `banner` function
var cmpts = {
  "loader": _webpack_path_to_module__,
  "autocomplete": _webpack_path_to_module__,
  "searchresults": _webpack_path_to_module__,
  "searchsuggestions": _webpack_path_to_module__
};
```

### `ignoreNodeModules`

Type: `Boolean`
Default: `true` unless "node_modules" is used within the import string, then `false`. Can be set manually to either true or false in which case that value is respected.

#### `ignoreNodeModules` Example:

**entry.js** (source)

```js
import cmpts from "../**/*.js"; // node_modules are not included by default
```

**entry2.js** (source)

```js
import cmpts from "../node_modules/**/*.js"; // node_modules are included by default
```
