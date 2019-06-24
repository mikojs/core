# [@cat-org/babel-plugin-transform-flow][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/babel-plugin-transform-flow.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/babel-plugin-transform-flow
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/babel-plugin-transform-flow.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/babel-plugin-transform-flow

Use to build the flow files with babel.

## Install

```sh
yarn add @cat-org/babel-plugin-transform-flow --dev
```

## Add `@cat-org/babel-plugin-transform-flow` to babel config.

```js
...
  plugins: [
    ...
    '@cat-org/transform-flow',
    ...
  ]
...
```

#### With the custom options

```js
...
  plugins: [
    ...
    [
      '@cat-org/transform-flow',
      {
        dir: './cutom-output-dir-path',
        relativeRoot: './relativeRoot-path-from-root',
        presets: ['other-babel-presets'],
        plugins: ['other-babel-plugins'],
        verbose: false,
        ignore: /ignore-pattern/,
      },
    ],
    ...
  ]
...
```

This plugin use [babel.transformsync](https://babeljs.io/docs/en/babel-core#transformsync) to build the flow files. This will read the `parserOpts` from your `babel` config automatically. However, we need to transform the code somtime.

For example, `pipeline` is not supported by `flow`. As a result, we need to add `@babel/proposal-pipeline-operator` in the `plugins` option to make `@cat-org/babel-plugin-transform-flow` transform the `pipeline` before build the file.
