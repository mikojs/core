# [@cat-org/use-css][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/use-css.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/use-css
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/use-css.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/use-css

Add css config to @cat-org/koa-react.

## Install

```sh
yarn add @cat-org/koa-react @cat-org/use-css
```

## Add `@cat-org/use-css` to config.

```sh
import React from '@cat-org/koa-react';
import useCss from '@cat-org/use-css';

const react = new React('./path-to-react-folder', useCss({}));
```
