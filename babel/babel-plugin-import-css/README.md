# [@mikojs/babel-plugin-import-css][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@mikojs/babel-plugin-import-css.svg
[npm-link]: https://www.npmjs.com/package/@mikojs/babel-plugin-import-css
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@mikojs/babel-plugin-import-css.svg

<!-- badges.end -->

[website]: https://mikojs.github.io/core/babel-plugin-import-css

Use to make the css files could be imported into `node` and `browser` with `babel-plugin-css-modules-transform`.

## Example

#### In

```js
import styles from './styles.css';
```

#### Out

```js
require(globalThis.window
  ? './styles.css'
  : '@mikojs/babel-plugin-import-css/emptyCssFile.js');
```

## Install

```sh
yarn add babel-plugin-css-modules-transform @mikojs/babel-plugin-import-css --dev
```

## Add `@mikojs/babel-plugin-import-css` to babel config.

```js
...
  plugins: [
    ...
    [
      'css-modules-transform',
      {
        keepImport: true,
      },
    ],
    '@mikojs/import-css',
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
      'css-modules-transform',
      {
        keepImport: true,
      },
    ],
    [
      '@mikojs/import-css',
      { test: /\.less$/ },
    ],
    ...
  ],
...
```
