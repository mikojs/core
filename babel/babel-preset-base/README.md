# [@mikojs/babel-preset-base][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@mikojs/babel-preset-base.svg
[npm-link]: https://www.npmjs.com/package/@mikojs/babel-preset-base
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@mikojs/babel-preset-base.svg

<!-- badges.end -->

[website]: https://mikojs.github.io/core/babel-preset-base

The base of babel plugin with mikojs.

## Install

```sh
yarn add @mikojs/babel-preset-base --dev
```

## Add `@mikojs/babel-preset-base` to babel config

```js
...
  presets: [
    ...
    '@mikojs/base',
    ...
  ],
...
```

#### With the custom options

```js
...
  presets: [
    ...
    [
      '@mikojs/base',
      {
        '@mikojs/transform-flow': {
          plugins: ['plugins'],
        },
      },
    ],
    ...
  ],
...
```
