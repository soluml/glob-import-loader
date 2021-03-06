[![Build Status](https://travis-ci.org/soluml/glob-import-loader.svg)](https://travis-ci.org/soluml/glob-import-loader.svg)
[![npm version](https://badge.fury.io/js/glob-import-loader.svg)](https://badge.fury.io/js/glob-import-loader)

# glob-import-loader

Webpack loader that enables ES6 imports with glob patterns. Leverages Webpack's [Enhanced Resolver](https://github.com/webpack/enhanced-resolve) to resolve aliases.

_Inspired by [webpack-import-glob-loader](https://github.com/fred104/webpack-import-glob-loader)_

## Known Issues

1. `?`, `+`, and `!` globbing characters have issues as they're currently incompatible with Enhanced Loader. Looking for workarounds!

## Notes on Sass's `@use` and `@forward`

@use's configuration syntax (`with`) and @forward's configuration syntax (`hide`) is not supported and will be ignored. These should not be used in a wildcard fashion.

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
