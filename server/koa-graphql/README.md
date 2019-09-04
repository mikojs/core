# [@cat-org/koa-graphql][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/koa-graphql.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/koa-graphql
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/koa-graphql.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/koa-graphql

Collect the graphql files to build the graphql automatically.

## Install

```sh
yarn add koa graphql @cat-org/koa-graphql
```

## Use `@cat-org/koa-graphql` to server

1. Add the middleware to server.

```js
import Koa from 'koa';
import Graphql from '@cat-org/koa-graphql';

const app = new Koa();
const graphql = new Graphql('./path-to-graphql-foder');

app.use(graphql.middleware());
```

2. Write the graphql files in `./path-to-graphql-foder`.

```js
// @flow

export default {
  typeDefs: `
  type Query {
    version: String!
  }
`,
  Query: {
    version: () => '1.0.0',
  },
};
```

#### Add the additional schema

Use with string:

```js
const graphql = new Graphql('./path-to-graphql-foder', {
  typeDefs: `
  type AdditionalType {
    key: String!
  }
  `,
  resolvers: {
    AdditionalType: () => { ... },
  },
});
```

Use with Array:

```js
const graphql = new Graphql('./path-to-graphql-foder', {
  typeDefs: [
    `
  type AdditionalType {
    key: String!
  }
`,
    `
  type AdditionalTwoType {
    key: String!
  }
`,
  ],
  resolvers: {
    AdditionalType: () => { ... },
    AdditionalTwoType: () => { ... },
  },
});
```

#### Update resolver with `babel watch`

```js
const graphql = new Graphql('./path-to-graphql-folder');

chokidar
  .watch('./path-to-graphql-folder', {
    ignoreInitial: true,
  })
  .on('change', (filePath: string) => {
    graphql.update(filePath);
  });
```

Note: This function will only update the resolvers. This can not update the schema definition becuse `graphql-tool` does not support add new schema definition.

#### Give the options to [makeExecutableSchema](https://github.com/apollographql/graphql-tools)

Expect for `typeDefs` and `resolvers`, you can add the other options in `makeExecutableSchema` to this middleware.

```js
const graphql = new Graphql('./path-to-graphql-foder', {
  options: { ... },
});
```

#### Give the options to [express-graphql](https://github.com/graphql/express-graphql)

Expect for `schema`, you can add the other options to this middleware.

```js
...
app.use(graphql.middleware({ ... }));
...
```

#### Use to compile with relay-compiler

1. Write a bin file or make server file to be a bin file.

```js
#! /usr/bin/env node

import Koa from 'koa';
import Graphql from '@cat-org/koa-graphql';

const app = new Koa();
const graphql = new Graphql('./path-to-graphql-foder');

(async () => {
  if (process.env.RELAY_COMPILER) {
    await graphql.relay(['relay-compiler', 'command', 'without', 'schema']);
    process.exit();
  }

  app.use(graphql.middleware());
})();
```

2. Run command with the bin file.

```sh
RELAY_COMPILER=true node ./server.js
```
