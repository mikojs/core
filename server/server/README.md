# [@mikojs/server][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@mikojs/server.svg
[npm-link]: https://www.npmjs.com/package/@mikojs/server
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@mikojs/server.svg

<!-- badges.end -->

[website]: https://mikojs.github.io/core/server

Run koa server with `pipeline` and `babel`. This package is just a helper. You can replace any method in `@mikojs/server` by using the custom functions.

## Install

```sh
yarn add koa @mikojs/server
```

## How to create a server

- `init`: Just use to return `Koa`. You can replace by `new Koa()`.
- `use`: Add middleware to the router or the server.
- `start`, `end`: Add a new router.
- `get`, `post`, `put`, `del`, `all`: Add method to this router.
- `run`: Just use to return a promise with `new Koa().listen(port)`. The default of the port is 8000.
- `watch`: Use this function to watch the changed file. This method is based on `chokidar`. You can write the same function by yourself. If you want to add the function to handle the changed file, you can add an array in the second argument.
- `restart`: Use this to restart the server.
- `close`: Use this to clsoe the server.

#### Build the server by yourself

By this way, you need to run `babel` by yourself and ues like `node ./lib/server.js`.

```js
server.init()
  |> server.use(async (ctx, next) => {
  })
  .
  .
  .
  |> server.run()
```

#### Use `@mikojs/server` to build the server

By this way, you do not need to run `babel` by yourself. This command will build the babel and run the server.

###### Run command

This command is base on `babel`. You can use any `babel` command expect for `yarn server ./src/server.js`.

```sh
yarn server src -d lib
// is equal to
yarn server src/server.js -o lib/server.js
// or
yarn server src/other-name.js -o lib/other-name.js
```

###### Environment variables

- `PORT`: Set the port of the server
- `NODE_ENV`: Set the dev mode or not.

###### Write a server file

```js
import server from '@mikojs/server';

export default ({ src, dir, dev, watch, port, restart, close }) =>
  server.init()
  |> server.use(async (ctx, next) => {
    await next();
  })
  |> ('/path'  // if this is undefined, this will not add prefix to router
    |> server.start
    |> ('/get'
    |> server.get  // this will render as /path/get with get method (post, put, del, all)
      |> server.use(async (ctx, next) => {
        await next();
      })
      |> server.end)
    |> server.use(async (ctx, next) => {
      await next();
    })
    |> server.end)
  |> (undefined
    |> server.start
    |> ('/get'  // this will render as /get with get method
      |> server.get
      |> server.end)
    |> server.end)
  |> server.run()
  |> (dev && watch
    ? server.watch(dir, [restart])
    : emptyFunction.thatReturnsArgument);
```
