# [Core][homepage] · <!-- badges.start -->[![circleci][circleci-image]][circleci-link] ![github-size][github-size-image] ![engine-node][engine-node-image] ![engine-npm][engine-npm-image] ![engine-yarn][engine-yarn-image] [![license][license-image]][license-link] [![lerna][lerna-image]][lerna-link] [![git-search-todo][git-search-todo-image]][git-search-todo-link]

[circleci-image]: https://img.shields.io/circleci/project/github/cat-org/core/master.svg
[circleci-link]: https://circleci.com/gh/cat-org/core
[github-size-image]: https://img.shields.io/github/repo-size/cat-org/core.svg
[engine-node-image]: https://img.shields.io/badge/node-%3E=%2010.2.1-green.svg
[engine-npm-image]: https://img.shields.io/badge/npm-%3E=%206.1.0-green.svg
[engine-yarn-image]: https://img.shields.io/badge/yarn-%3E=%201.7.0-green.svg
[license-image]: https://img.shields.io/github/license/cat-org/core.svg
[license-link]: ./LICENSE
[lerna-image]: https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg
[lerna-link]: https://lernajs.io
[git-search-todo-image]: https://img.shields.io/github/search/cat-org/core/todo+-language:markdown?label=todo
[git-search-todo-link]: https://github.com/cat-org/core/search?q=todo+-language:markdown&unscoped_q=todo+-language:markdown

<!-- badges.end -->

[homepage]: https://cat-org.github.io/core/

The packages in this repo are used to create a new project for `@cat-org/create-project`.

#### Babel

Here are the plugins for `babel`.

- [@cat-org/babel-preset-base](./babel/babel-preset-base)
- [@cat-org/babel-plugin-import-css](./babel/babel-plugin-import-css)
- [@cat-org/babel-plugin-transform-flow](./babel/babel-plugin-transform-flow)

#### Server

Here are the plugins for building the server.

- [@cat-org/server](./server/server)
- [@cat-org/koa-base](./server/koa-base)
- [@cat-org/koa-graphql](./server/koa-graphql)
- [@cat-org/koa-react](./server/koa-react)
  - [@cat-org/use-css](./server/use-css)
  - [@cat-org/use-less](./server/use-less)

#### Others

Here are the other packages for creating a new project.

- [@cat-org/create-project](./packages/create-project)
- [@cat-org/utils](./packages/utils)
- [@cat-org/logger](./packages/logger)
- [@cat-org/configs](./packages/configs)
- [@cat-org/badges](./packages/badges)
- [@cat-org/lerna-flow-typed-install](./packages/lerna-flow-typed-instal)
- [@cat-org/eslint-config-cat](./packages/eslint-config-cat)
- [@cat-org/jest](./packages/jest)

## Development

This project use `lerna` to manage packages. You can use:

- `install:all`: Install the all pacakges.
- `prod`: Build the production packages.
- `release`: Release the packages.
- `test`: Run the testing.
- `clean`: Clean the all files which is built by the packages.
