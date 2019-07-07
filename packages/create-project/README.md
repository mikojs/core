# [@cat-org/create-project][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/create-project.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/create-project
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/create-project.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/create-project

Use to create a new project. This package supports to use with `babel`, `flow`, `prettier`, `eslint`, and `jest`. This will also use `husky` and `lint-staged` to check the commit.

## Run command

```sh
yarn create @cat-org/project ./new-project
```

- `--lerna`: If you want to add a new project to a lerna-managed project, you can use `yarn create @cat-org/project --lerna`.
- You can see the all example projects [here](./src/__tests__/__ignore__).
