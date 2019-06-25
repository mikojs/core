# [@cat-org/server][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/server.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/server
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/server.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/server

Run koa server with pipeline.

## Install

```sh
yarn add @cat-org/server
```

## Run server without any files

You can add those modules in your project and `@cat-org/server` will load the default config for those modules.

- `@cat-org/koa-base`
- `@cat-org/koa-graphql`
- `@cat-org/koa-react`
  - `@cat-org/use-css`
  - `@cat-org/use-less`

#### Run command

This command is base on `babel` cli. You can use any `babel` command, but this is needed to use `-d` or `--out-dir` in the command.

```sh
yarn server src -d lib
```

Run command without building js in the production mode.

```sh
NODE_ENV=production yarn server src -d lib --skip-build
```

Run command without running relay-compiler.

```sh
yarn server src -d lib --skip-relay
```

Run command without running server.

```sh
yarn server src -d lib --skip-server
```

#### Use in testing

```js
import server from '@cat-org/server/lib/bin';

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
import server from '@cat-org/server';

(async () => {
  // `runningServer` is from `app.listen()`, you can close or do other things
  const runningServer = await ((await server.init({
    src: 'src',
    dir: 'lib',
  })
    |> server.event(async () => {
      // do something after babel bulid
      // this will not use like as a middleware
      // this will only run at the begin
    })
    |> server.use(async (ctx, next) => {
      await next();
    })
    |> ('/path'                                 // if this is undefined, this will not add prefix to router
      |> server.start
      |> ('/get'
        |> server.get                           // this will render as /path/get with get method (post, put, del, all)
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
      |> ('/get'                                // this will render as /get with get method
        |> server.get
        |> server.end)
      |> server.end)
    |> server.run);
})();
```

#### With the custom options

```js
await server.init({
  src: 'src',
  dir: 'lib',
  dev: true,
  watch: true,
  babelOptions: ['--verbose'],
  port: 8000,
});
```
