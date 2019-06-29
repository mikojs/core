# [@cat-org/use-less][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/use-less.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/use-less
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/use-less.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/use-less

Add less config to @cat-org/koa-react.

## Install

```sh
yarn add @cat-org/koa-react cat-org/use-less
```

## Add `@cat-org/use-less` to config.

```sh
import React from '@cat-org/koa-react';
import useLess from '@cat-org/use-less';

const react = new React('./path-to-react-folder', useLess({}));
```
