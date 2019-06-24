# [@cat-org/badges][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/badges.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/badges
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/badges.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/badges

Use to add badges to `README.md`.

## Install

```sh
yarn add @cat-org/badges --dev
```

## Run command

1. Add `badges.start` and `badges.end` comments to `README.md`.
2. Run command.

```sh
yarn badges ./README.md
```

## Add to `@cat-org/badges` to lint-staged

```js
...
  '**/README.md': [
    'badges',
    'git add',
  ],
...
```
