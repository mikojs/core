# [@cat-org/jest][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/jest.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/jest
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/jest.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/jest

Jest setup files.

## Install

```sh
yarn add @cat-org/jest --dev
```

## Add default jest setup file to jest config

```js
...
  setupFiles: ['@cat-org/jest']
...
```

## Add react jest setup file to jest config

You should install `enzyme-adapter-react-16`, `react`, `react-dom` before using ths config file

```js
...
  setupFiles: ['@cat-org/jest/lib/react']
...
```
