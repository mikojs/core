# [@cat-org/babel-plugin-import-css][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/babel-plugin-import-css.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/babel-plugin-import-css
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/babel-plugin-import-css.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/babel-plugin-import-css

Use to make the css files can be imported into `node` and `browser`.

## Install

```sh
yarn add @cat-org/babel-plugin-import-css --dev
```

## Add `@cat-org/babel-plugin-import-css` to babel config.

```js
...
  plugins: [
    ...
    '@cat-org/import-css',
    ...
  ],
...
```

#### Use with less

```js
...
  plugins: [
    ...
    [
      '@cat-org/import-css',
      { test: /\.less$/ },
    ],
    ...
  ],
...
```
