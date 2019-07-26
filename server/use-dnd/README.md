# [@cat-org/use-dnd][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/use-dnd.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/use-dnd
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/use-dnd.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/use-dnd

Add dnd config to @cat-org/koa-react

## Install

```sh
yarn add @cat-org/koa-react @cat-org/use-dnd
```

## Add `@cat-org/use-dnd` to config.

```sh
import React from '@cat-org/koa-react';
import useDnd from '@cat-org/use-dnd';

const react = new React('./path-to-react-folder', useDnd({}));
```
