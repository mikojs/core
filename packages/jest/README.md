# [@mikojs/jest][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@mikojs/jest.svg
[npm-link]: https://www.npmjs.com/package/@mikojs/jest
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@mikojs/jest.svg

<!-- badges.end -->

[website]: https://mikojs.github.io/core/jest

Jest setup files.

## Install

```sh
yarn add @mikojs/jest --dev
```

## Add default jest setup file to jest config

```js
...
  setupFiles: ['@mikojs/jest']
...
```

## Add react jest setup file to jest config

You should install `enzyme-adapter-react-16`, `react`, `react-dom` before using ths config file

```js
...
  setupFiles: ['@mikojs/jest/lib/react']
...
```
