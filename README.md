[![Build Status](https://travis-ci.org/soluml/glob-import-loader.svg)](https://travis-ci.org/soluml/glob-import-loader.svg)
[![npm version](https://badge.fury.io/js/glob-import-loader.svg)](https://badge.fury.io/js/glob-import-loader)

# glob-import-loader

Webpack loader that enables ES6 imports with glob patterns. Leverages Webpack's [Enhanced Resolver](https://github.com/webpack/enhanced-resolve) to resolve aliases.

_Inspired by [webpack-import-glob-loader](https://github.com/fred104/webpack-import-glob-loader)_

## Known Issues

1. `?`, `+`, and `!` globbing characters have issues as they're currently incompatible with Enhanced Loader. Looking for workarounds!
