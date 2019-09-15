# [@mikojs/use-less][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@mikojs/use-less.svg
[npm-link]: https://www.npmjs.com/package/@mikojs/use-less
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@mikojs/use-less.svg

<!-- badges.end -->

[website]: https://mikojs.github.io/core/use-less

Add less config to @mikojs/koa-react.

## Install

```sh
yarn add @mikojs/koa-react mikojs/use-less
```

## Add `@mikojs/use-less` to config.

```sh
import React from '@mikojs/koa-react';
import useLess from '@mikojs/use-less';

const react = new React('./path-to-react-folder', useLess({}));
```
