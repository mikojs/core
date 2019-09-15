# [@mikojs/koa-base][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@mikojs/koa-base.svg
[npm-link]: https://www.npmjs.com/package/@mikojs/koa-base
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@mikojs/koa-base.svg

<!-- badges.end -->

[website]: https://mikojs.github.io/core/koa-base

The base of koa middleware with mikojs.

## Install

```sh
yarn add koa @mikojs/koa-base
```

## Add `@mikojs/koa-base` to server

```js
import Koa from 'koa';
import base from '@mikojs/koa-base';

const app = new Koa();

app.use(base);
```
