# [@mikojs/badges][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@mikojs/badges.svg
[npm-link]: https://www.npmjs.com/package/@mikojs/badges
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@mikojs/badges.svg

<!-- badges.end -->

[website]: https://mikojs.github.io/core/badges

Add the badges to `README.md`.

## Install

```sh
yarn add @mikojs/badges --dev
```

## Run command

1. Add `badges.start` and `badges.end` comments to `README.md`.
2. Run command.

```sh
yarn badges ./README.md
```

## Add to `@mikojs/badges` to lint-staged

```js
...
  '**/README.md': [
    'badges',
    'git add',
  ],
...
```
