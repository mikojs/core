# [@cat-org/koa-react][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/koa-react.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/koa-react
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/koa-react.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/koa-react

Collect the react files to build the pages automatically.

## Install

```sh
yarn add koa react react-dom @cat-org/koa-react
yarn add --dev webpack
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

You can see [here](./#how-to-write-the-components) to lerna more about writing the components.

#### Update page with `babel watch`

```js
const react = new React('./path-to-react-folder');

chokidar
  .watch('./path-to-react-folder', {
    ignoreInitial: true,
  })
  .on('change', (filePath: string) => {
    react.update(filePath);
  });
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

## How to write the components

This middleware is like [next.js](https://github.com/zeit/next.js). However, this middleware is base on `react-router-dom`, `react-helmet` and `koa-webpack`. You can use all the feature of those library.

#### Page component

Each component will be used to build the page like `next.js`. If you want to use the url parameters, you can add a file like `[foo].js` or make a folder like `[foo]`. Then, you can get the variables from the match in the arguments of the `getInitialProps`. You can see [here](https://reacttraining.com/react-router/web/example/url-params) to lerna the more information about `match`.

```js
export default class Page extend React.PureComponent {
  /**
   * This function is optional. You only need to add this function when you need to get the initial props or set the helmet.
   *
   * @param {ctx} ctx - koa context in server and react-router-dom context in client
   * @param {boolean} isServer - is in Server or not
   *
   * @return {object} - the initial props and head(optional)
   */
  static getInitialProps = ({ ctx, isServer }) => {
    // do some thing

    return { ... };
  };

  render() {
    const { ...initialProps } = this.props;

    return (
      <div>...</div>
    );
  }
}
```

#### `.template` folder

In your pages folder, you can add a `.templates` folder to add ths custom template component. You can see the default templates [here](./src/templates) to lerna more about how to write the custom template component.

In our components, we use [react-helmet](https://github.com/nfl/react-helmet) to build the head of the document. You can use this in `Documenet`, `Main` and the page components to control the head of the document.

###### Document

Only run in the server. Use to add `meta`, `scripts` and so on, and you can get the `react-helmet` object from the props.

```js
export default class Document extend React.PureComponent {
  /**
   * This function is optional. You only need to add this function when you need to get the initial props or set the helmet.
   *
   * @param {ctx} ctx - koa context
   * @param {boolean} isServer - is in Server or not
   *
   * @return {object} - the initial props and head(optional)
   */
  static getInitialProps = ({ ctx, isServer }) => {
    // do some thing

    return { ... };
    // or
    return {
      head: (
        <Helmet>
          <title>cat-org</title>
        </Helmet>
      )
    };
  };

  render() {
    const { helmet, children, ...initialProps } = this.props;

    return (
      <html>
        <head>
          {helmet.meta.toComponent()}
          {helmet.title.toComponent()}
          {helmet.link.toComponent()}
        </head>

        {...}
        {children}
      </html>
    );
  }
}
```

###### Main

The main component is used to controll the providers and you can get the page Component from the props.

```js
export default class Main extend React.PureComponent {
  /**
   * This function is optional. You only need to add this function when you need to get the initial props or set the helmet.
   *
   * @param {ctx} ctx - koa context in server and react-router-dom context in client
   * @param {boolean} isServer - is in Server or not
   * @param {Component} Component - page component
   * @param {Object} pageProps - page inital props
   *
   * @return {object} - the initial props and head(optional)
   */
  static getInitialProps = ({ ctx, isServer, Component, pageProps }) => {
    // do some thing

    return { ... };
    // or
    return {
      head: (
        <Helmet>
          <title>cat-org</title>
        </Helmet>
      )
    };
  };

  render() {
    const { Componet, children, ...initialProps } = this.props;

    return (
      <div>
        ...
        {children(/** you can pass the data to page component */)}
      </div>
    );
  }
}
```

###### Error

When component trigger `componentDidCatch`, this will not render the page. It will render `Error`.

```js
const Error = (
  { error, errorInfo } /** the data from componentDidCatch in react */,
) => <div>...</div>;

export default Error;
```

###### Loading

When page is changed, this will render `Loading`. We use `Loading` with [react suspense](https://reactjs.org/docs/code-splitting.html#suspense).

```js
const Loading = () => <div>...</div>;

export default Loading;
```
