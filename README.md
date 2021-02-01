# [Core][homepage] · <!-- badges.start -->[![circleci][circleci-image]][circleci-link] ![github-size][github-size-image] ![engine-node][engine-node-image] ![engine-npm][engine-npm-image] ![engine-yarn][engine-yarn-image] [![license][license-image]][license-link] [![lerna][lerna-image]][lerna-link] [![git-search-todo][git-search-todo-image]][git-search-todo-link]

[circleci-image]: https://img.shields.io/circleci/project/github/mikojs/core/main.svg
[circleci-link]: https://circleci.com/gh/mikojs/core
[github-size-image]: https://img.shields.io/github/repo-size/mikojs/core.svg
[engine-node-image]: https://img.shields.io/badge/node-%3E=%2010.2.1-green.svg
[engine-npm-image]: https://img.shields.io/badge/npm-%3E=%206.1.0-green.svg
[engine-yarn-image]: https://img.shields.io/badge/yarn-%3E=%201.7.0-green.svg
[license-image]: https://img.shields.io/github/license/mikojs/core.svg
[license-link]: ./LICENSE
[lerna-image]: https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg
[lerna-link]: https://lernajs.io
[git-search-todo-image]: https://img.shields.io/github/search/mikojs/core/todo+-language:markdown?label=todo
[git-search-todo-link]: https://github.com/mikojs/core/search?q=todo+-language:markdown&unscoped_q=todo+-language:markdown

<!-- badges.end -->

[homepage]: https://mikojs.github.io/core/

The packages in this repo are used to create a new project quickly. The new project will be base on `babel`, `eslint`, `flow`, `husky`, `jest`, `lint-staged`, `mikojs`, `prettier`.

#### Babel

Here are the plugins for `babel`.

- [@mikojs/babel-preset-base](./babel/babel-preset-base)
- [@mikojs/babel-plugin-import-css](./babel/babel-plugin-import-css)
- [@mikojs/babel-plugin-transform-flow](./babel/babel-plugin-transform-flow)

#### Server

Here are the plugins for building the server.

- [@mikojs/server](./server/server)
- [@mikojs/koa-base](./server/koa-base)
- [@mikojs/koa-graphql](./server/koa-graphql)
- [@mikojs/koa-react](./server/koa-react)
  - [@mikojs/use-css](./server/use-css)
  - [@mikojs/use-less](./server/use-less)

#### Others

Here are the other packages for creating a new project.

- [@mikojs/utils](./packages/utils)
- [@mikojs/configs](./packages/configs)
- [@mikojs/badges](./packages/badges)
- [@mikojs/eslint-config-base](./packages/eslint-config-base)
- [@mikojs/jest](./packages/jest)

## Development

This project use `lerna` to manage packages. You could use:

- `prod`: Build the production packages.
- `release`: Release the packages.
- `test`: Run the testing.
- `clean`: Clean the all files which is built by the packages.
