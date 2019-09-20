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

#### Run command

This command is base on `babel`. You can use any `babel` command expect for `yarn server ./src/server.js`.
If you want to use the `default server`, you need to have a soruce folder. For example:

```sh
yarn server src -d lib
```

If you want to use the `custom server`, you need to add a custom server file, For example:

```js
import server form '@mikojs/server';

export default () =>
  server.init()
    |> server.run()
```

And run with:

```sh
yarn server ./src/server.js -o ./lib/server.js
```

###### Environment variables

- `PORT`: Set the port of the server
- `NODE_ENV`: Set the dev mode or not.

#### Use default server in testing

```js
import server from '@mikojs/server/lib/defaults';

let runningServer;

describe('server', () => {
  beforeAll(async () => {
    runningServer = await server({
      src: './path-to-src-folder',
      dir: './path-to-dir-folder',
    });
  });

  afterAll(() => {
    runningServer.close();
  });
});
```

## Write the custom server

```js
import server from '@mikojs/server';

export default ({ src, dir, dev, watch, port, restart }) =>
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

- `init`: Just use to return `Koa`. You can replace by `new Koa()`.
- `use`: Add middleware to the router or the server.
- `start`, `end`: Add a new router.
- `get`, `post`, `put`, `del`, `all`: Add method to this router.
- `run`: Just use to return a promise with `new Koa().listen(port)`. The default of the port is 8000.
- `watch`: Use this function to watch the changed file. This method is based on `chokidar`. You can write the same function by yourself. If you want to add the function to handle the changed file, you can add an array in the second argument.
- `restart`: You can use this to restart the server.

## Load plugins with default server

You can add those packages in your project and `@mikojs/server` will load the default config for those modules.

- `@mikojs/koa-base`
- `@mikojs/koa-graphql`
- `@mikojs/koa-react`
  - `@mikojs/use-css`
  - `@mikojs/use-less`

You only need to do this:

```sh
yarn add @mikojs/package-name
```

#### Environment variables about those plugins

- Run command without building js in the production mode.

```sh
SKIP_BUILD=true NODE_ENV=production yarn server src -d lib
```

- Run command without running relay-compiler.

```sh
SKIP_RELAY=true yarn server src -d lib
```

- Run command without running server.

```sh
SKIP_SERVER=true yarn server src -d lib
```
