# [@mikojs/use-css][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@mikojs/use-css.svg
[npm-link]: https://www.npmjs.com/package/@mikojs/use-css
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@mikojs/use-css.svg

<!-- badges.end -->

[website]: https://mikojs.github.io/core/use-css

Add css config to @mikojs/koa-react.

## Install

```sh
yarn add @mikojs/koa-react @mikojs/use-css
```

## Add `@mikojs/use-css` to config.

```sh
import React from '@mikojs/koa-react';
import useCss from '@mikojs/use-css';

const react = new React('./path-to-react-folder', useCss({}));
```
