# [@cat-org/koa-base][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/koa-base.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/koa-base
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/koa-base.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/koa-base

The base of koa middleware with cat-org.

## Install

```sh
yarn add koa @cat-org/koa-base
```

## Add `@cat-org/koa-base` to server

```js
import Koa from 'koa';
import base from '@cat-org/koa-base';

const app = new Koa();

app.use(base);
```
