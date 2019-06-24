# [@cat-org/koa-react][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/koa-react.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/koa-react
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/koa-react.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/koa-react

Collect the react files to build the pages automatically.

## Install

```sh
yarn add koa @cat-org/koa-react
```

## Use `@cat-org/koa-react` to server

1. Add the middleware to server.

```js
import Koa from 'koa';
import React from '@cat-org/koa-react';

const app = new Koa();
const react = new React('./path-to-react-folder');

(async () => {
  app.use(await react.middleware());
})();
```

2. Write the react file in the `./path-to-react-folder`.

```js
// @flow

export default () => 'Home';
```

#### With the custom options

```js
const react = new React('./path-to-react-folder', {
  dev: true,
  redirect: prevPaths => redirectPaths,
  basename: '/basename',
  exclude: /ignore/,
});
```

#### Give the options to [koa-webpack](https://github.com/shellscape/koa-webpack)

You can get the defailt config options from the argument and you need to return the new config options to the middleware.

```js
const react = new React('./path-to-react-folder', {
  config: prevConfig => newConfig,
});
```

#### Use to build js

1. Write a bin file or make server file to be a bin file.

```js
#! /usr/bin/env node

import Koa from 'koa';
import React from '@cat-org/koa-react';

const app = new Koa();
const react = new React('./path-to-react-folder');

(async () => {
  if (process.env.BUILD_JS) {
    await react.buildJs();
    process.exit();
  }

  app.use(await react.middleware());
})();
```

2. Run command with the bin file.

```sh
BUILD_JS=true node ./server.js
```

#### Use to build the static files

1. Write a bin file or make server file to be a bin file.

```js
#! /usr/bin/env node

import Koa from 'koa';
import React from '@cat-org/koa-react';

const app = new Koa();
const react = new React('./path-to-react-folder');

(async () => {
  if (process.env.BUILD_STATIC) {
    await react.buildStatic();
    process.exit();
  }

  app.use(await react.middleware());
})();
```

2. Run command with the bin file.

```sh
BUILD_STATIC=true node ./server.js
```

###### With the custom options

```js
...
await react.buildStatic({
  baseUrl: 'http://localhost:8000',
  folderPath: path.resolve('./custom-output-dir'),
});
...
```
