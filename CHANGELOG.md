# CHANGELOG

## 1.0.0-beta.12 (2019-01-02)

#### :rocket: New Feature

- `create-project`
  - [#109](https://github.com/cat-org/core/pull/109) Add stores to @cat-org/create-project ([@HsuTing](https://github.com/HsuTing))
- `lerna-create`, `lerna-flow-typed-install`
  - [#107](https://github.com/cat-org/core/pull/107) Add @cat-org/lerna-flow-typed-install ([@HsuTing](https://github.com/HsuTing))
- `badges`, `configs`, `create-project`
  - [#100](https://github.com/cat-org/core/pull/100) Add license to @cat-org/create-project, add @cat-org/badges ([@HsuTing](https://github.com/HsuTing))
- `configs`, `jest`
  - [#99](https://github.com/cat-org/core/pull/99) add @cat-org/jest ([@HsuTing](https://github.com/HsuTing))

#### :bug: Bug Fix

- `lerna-create`
  - [#101](https://github.com/cat-org/core/pull/101) Fix multiple workspaces error ([@HsuTing](https://github.com/HsuTing))

#### :house: Internal

- `babel-plugin-transform-flow`, `badges`, `configs`, `create-project`, `eslint-config-cat`, `jest`, `lerna-create`, `lerna-flow-typed-install`, `utils`
  - [#108](https://github.com/cat-org/core/pull/108) Minify utils ([@HsuTing](https://github.com/HsuTing))
- `babel-plugin-transform-flow`, `badges`, `configs`, `create-project`, `eslint-config-cat`, `jest`, `lerna-create`, `logger`, `utils`
  - [#105](https://github.com/cat-org/core/pull/105) Write readme and remove slash after link ([@HsuTing](https://github.com/HsuTing))
- `babel-plugin-transform-flow`, `configs`, `create-project`, `eslint-config-cat`, `jest`, `lerna-create`, `logger`, `utils`
  - [#103](https://github.com/cat-org/core/pull/103) Rename cat-core to core ([@HsuTing](https://github.com/HsuTing))

#### Committers: 1

- Ting-Hsiang Hsu ([@HsuTing](https://github.com/HsuTing))

## 1.0.0-beta.11 (2018-12-15)

#### :boom: Breaking Change

- `create-app`, `create-project`, `utils`
  - [#95](https://github.com/cat-org/cat-core/pull/95) Rewrite @cat-org/create-app, and rename as @cat-org/create-project ([@HsuTing](https://github.com/HsuTing))
- `configs`, `create-app`, `helper`, `utils`
  - [#88](https://github.com/cat-org/cat-core/pull/88) Remove helper ([@HsuTing](https://github.com/HsuTing))
- `create-app`
  - [#87](https://github.com/cat-org/cat-core/pull/87) create-app@beta-1 ([@HsuTing](https://github.com/HsuTing))

#### :rocket: New Feature

- `lerna-create`
  - [#94](https://github.com/cat-org/cat-core/pull/94) Remove bin in new pkg ([@HsuTing](https://github.com/HsuTing))
- `cli`, `lerna-create`, `logger`
  - [#93](https://github.com/cat-org/cat-core/pull/93) Add @cat-org/lerna-create ([@HsuTing](https://github.com/HsuTing))
- `cli`, `configs`, `create-app`, `utils`
  - [#89](https://github.com/cat-org/cat-core/pull/89) Add @cat-org/cli ([@HsuTing](https://github.com/HsuTing))

#### :house: Internal

- `lerna-create`
  - [#96](https://github.com/cat-org/cat-core/pull/96) @cat-org/lerna-create modify detail ([@HsuTing](https://github.com/HsuTing))
- `cli`, `configs`, `create-app`
  - [#92](https://github.com/cat-org/cat-core/pull/92) Rename configs-scripts to configs ([@HsuTing](https://github.com/HsuTing))
- `babel-plugin-transform-flow`, `configs`, `create-app`, `eslint-config-cat`, `helper`
  - [#85](https://github.com/cat-org/cat-core/pull/85) Upgrade version ([@HsuTing](https://github.com/HsuTing))

#### Committers: 1

- Ting-Hsiang Hsu ([@HsuTing](https://github.com/HsuTing))

## 1.0.0-beta.10 (2018-11-16)

#### :rocket: New Feature

- `configs`, `create-app`
  - [#79](https://github.com/cat-org/cat-core/pull/79) Add @cat-org/create-app@beta ([@HsuTing](https://github.com/HsuTing))
- `configs`, `eslint-config-cat`, `helper`, `logger`, `utils`
  - [#82](https://github.com/cat-org/cat-core/pull/82) Support json log and remove bin core ([@HsuTing](https://github.com/HsuTing))

#### :bug: Bug Fix

- `configs`, `eslint-config-cat`, `helper`, `logger`, `utils`
  - [#82](https://github.com/cat-org/cat-core/pull/82) Support json log and remove bin core ([@HsuTing](https://github.com/HsuTing))
- `configs`, `helper`
  - [#81](https://github.com/cat-org/cat-core/pull/81) Fix regenerator-runtime error ([@HsuTing](https://github.com/HsuTing))

#### :house: Internal

- `helper`
  - [#83](https://github.com/cat-org/cat-core/pull/83) Modify helper ([@HsuTing](https://github.com/HsuTing))

#### Committers: 1

- Ting-Hsiang Hsu ([@HsuTing](https://github.com/HsuTing))

## 1.0.0-beta.9 (2018-10-30)

#### :boom: Breaking Change

- `configs`, `logger`
  - [#75](https://github.com/cat-org/cat-core/pull/75) Add ora logger ([@HsuTing](https://github.com/HsuTing))

#### :rocket: New Feature

- `helper`
  - [#72](https://github.com/cat-org/cat-core/pull/72) Add @cat-org/helper@beta.1 ([@HsuTing](https://github.com/HsuTing))
- `configs`, `logger`
  - [#75](https://github.com/cat-org/cat-core/pull/75) Add ora logger ([@HsuTing](https://github.com/HsuTing))
- `configs`
  - [#71](https://github.com/cat-org/cat-core/pull/71) Can read pkg configs and custom configs at the same time ([@HsuTing](https://github.com/HsuTing))
- `babel-plugin-transform-flow`, `configs`
  - [#69](https://github.com/cat-org/cat-core/pull/69) Use execa ([@HsuTing](https://github.com/HsuTing))

#### :bug: Bug Fix

- `configs`, `logger`
  - [#78](https://github.com/cat-org/cat-core/pull/78) Fix detail ([@HsuTing](https://github.com/HsuTing))
- `logger`
  - [#77](https://github.com/cat-org/cat-core/pull/77) fix ora setting in @cat-org/logger ([@HsuTing](https://github.com/HsuTing))
- `babel-plugin-transform-flow`, `configs`, `eslint-config-cat`, `logger`, `utils`
  - [#73](https://github.com/cat-org/cat-core/pull/73) Fix lint-staged not checking package.json ([@HsuTing](https://github.com/HsuTing))
- Other
  - [#68](https://github.com/cat-org/cat-core/pull/68) fix husky upgrade ([@HsuTing](https://github.com/HsuTing))

#### Committers: 1

- Ting-Hsiang Hsu ([@HsuTing](https://github.com/HsuTing))

## 1.0.0-beta.8 (2018-10-02)

FIX publish error

## 1.0.0-beta.7 (2018-10-02)

#### :boom: Breaking Change

- `babel-plugin-transform-flow`, `configs`, `utils`
  - [#64](https://github.com/cat-org/cat-core/pull/64) remove @cat-org/babel-transform-flow-comments ([@HsuTing](https://github.com/HsuTing))

#### :rocket: New Feature

- `configs`, `logger`, `utils`
  - [#61](https://github.com/cat-org/cat-core/pull/61) Add @cat-org/logger ([@HsuTing](https://github.com/HsuTing))
- `configs`
  - [#58](https://github.com/cat-org/cat-core/pull/58) configs-scripts read pkg configs, first ([@HsuTing](https://github.com/HsuTing))
- `babel-plugin-transform-flow`, `configs`, `eslint-config-cat`, `utils`
  - [#53](https://github.com/cat-org/cat-core/pull/53) coverage 100%, fix bug, upgrade packages, flow, lint ([@HsuTing](https://github.com/HsuTing))
- `babel-plugin-transform-flow`, `configs`, `utils`
  - [#47](https://github.com/cat-org/cat-core/pull/47) Configs scripts ([@HsuTing](https://github.com/HsuTing))
- `utils`
  - [#50](https://github.com/cat-org/cat-core/pull/50) feat(utils): add handleRejection to utils ([@HsuTing](https://github.com/HsuTing))
- `babel-plugin-transform-flow`, `eslint-config-cat`
  - [#45](https://github.com/cat-org/cat-core/pull/45) Add prefer-destructuring to eslint-config-cat ([@HsuTing](https://github.com/HsuTing))

#### :bug: Bug Fix

- `babel-plugin-transform-flow`, `configs`
  - [#66](https://github.com/cat-org/cat-core/pull/66) Fix transform flow ([@HsuTing](https://github.com/HsuTing))

#### :house: Internal

- `babel-plugin-transform-flow`, `configs`, `eslint-config-cat`, `utils`
  - [#53](https://github.com/cat-org/cat-core/pull/53) coverage 100%, fix bug, upgrade packages, flow, lint ([@HsuTing](https://github.com/HsuTing))
- Other
  - [#48](https://github.com/cat-org/cat-core/pull/48) Link packages in the root folder ([@HsuTing](https://github.com/HsuTing))

#### Committers: 1

- Ting-Hsiang Hsu ([@HsuTing](https://github.com/HsuTing))

## 1.0.0-beta.6 (2018-08-06)

#### :boom: Breaking Change

- `babel-plugin-transform-flow`, `utils`
  - [#38](https://github.com/cat-org/cat-core/pull/38) Modify babel plugin transform flow ([@HsuTing](https://github.com/HsuTing))

#### :rocket: New Feature

- `babel-plugin-transform-flow`, `utils`
  - [#38](https://github.com/cat-org/cat-core/pull/38) Modify babel plugin transform flow ([@HsuTing](https://github.com/HsuTing))
- `eslint-config-cat`
  - [#39](https://github.com/cat-org/cat-core/pull/39) new rules in eslint-config-cat ([@HsuTing](https://github.com/HsuTing))

#### :bug: Bug Fix

- `eslint-config-cat`
  - [#39](https://github.com/cat-org/cat-core/pull/39) new rules in eslint-config-cat ([@HsuTing](https://github.com/HsuTing))

#### :house: Internal

- `configs`, `eslint-config-cat`
  - [#43](https://github.com/cat-org/cat-core/pull/43) Modify testing ([@HsuTing](https://github.com/HsuTing))
- `eslint-config-cat`, `utils`
  - [#42](https://github.com/cat-org/cat-core/pull/42) Modify eslint config cat ([@HsuTing](https://github.com/HsuTing))

#### Committers: 1

- Ting-Hsiang Hsu ([@HsuTing](https://github.com/HsuTing))

## 1.0.0-beta.5 (2018-07-22)

#### :rocket: New Feature

- `babel-plugin-transform-flow`, `configs`, `eslint-config-cat`, `utils`
  - [#36](https://github.com/cat-org/cat-core/pull/36) add @cat-org/babel-plugin-transform-flow ([@HsuTing](https://github.com/HsuTing))
- `eslint-config-cat`, `utils`
  - [#34](https://github.com/cat-org/cat-core/pull/34) Add eslint plugin prettier ([@HsuTing](https://github.com/HsuTing))
  - [#30](https://github.com/cat-org/cat-core/pull/30) Add options to d3DirTree ([@HsuTing](https://github.com/HsuTing))
- `configs`, `utils`
  - [#25](https://github.com/cat-org/cat-core/pull/25) new configs ([@HsuTing](https://github.com/HsuTing))
- `configs`, `eslint-config-cat`
  - [#21](https://github.com/cat-org/cat-core/pull/21) Only check files with lint-staged ([@HsuTing](https://github.com/HsuTing))

#### :bug: Bug Fix

- `eslint-config-cat`
  - [#18](https://github.com/cat-org/cat-core/pull/18) remove minProperties in object-curly-newline ([@HsuTing](https://github.com/HsuTing))

#### :house: Internal

- `babel-plugin-transform-flow`, `configs`, `eslint-config-cat`, `utils`
  - [#37](https://github.com/cat-org/cat-core/pull/37) Add tests ([@HsuTing](https://github.com/HsuTing))
- `configs`, `eslint-config-cat`, `utils`
  - [#35](https://github.com/cat-org/cat-core/pull/35) Remove modifyPackagesPkg ([@HsuTing](https://github.com/HsuTing))
  - [#33](https://github.com/cat-org/cat-core/pull/33) enhanced flow checking ([@HsuTing](https://github.com/HsuTing))
- `eslint-config-cat`
  - [#32](https://github.com/cat-org/cat-core/pull/32) Modify code style ([@HsuTing](https://github.com/HsuTing))
- `eslint-config-cat`, `utils`
  - [#26](https://github.com/cat-org/cat-core/pull/26) Modify copy flow files ([@HsuTing](https://github.com/HsuTing))
- Other
  - [#31](https://github.com/cat-org/cat-core/pull/31) Move executable files to bin folder ([@HsuTing](https://github.com/HsuTing))
- `configs`
  - [#29](https://github.com/cat-org/cat-core/pull/29) Modify configs and ignore files ([@HsuTing](https://github.com/HsuTing))
- `configs`, `eslint-config-cat`
  - [#22](https://github.com/cat-org/cat-core/pull/22) Root check lint ([@HsuTing](https://github.com/HsuTing))
  - [#21](https://github.com/cat-org/cat-core/pull/21) Only check files with lint-staged ([@HsuTing](https://github.com/HsuTing))

#### Committers: 1

- Ting-Hsiang Hsu ([@HsuTing](https://github.com/HsuTing))

## 1.0.0-beta.3 (2018-06-24)

#### :rocket: New Feature

- `eslint-config-cat`
  - [#16](https://github.com/cat-org/cat-core/pull/16) add check configs. ([@HsuTing](https://github.com/HsuTing))

#### Committers: 1

- Ting-Hsiang Hsu ([HsuTing](https://github.com/HsuTing))

## 1.0.0-beta.2 (2018-06-24)

#### :rocket: New Feature

- `configs`, `eslint-config-cat`, `utils`
  - [#15](https://github.com/cat-org/cat-core/pull/15) Add prettier. ([@HsuTing](https://github.com/HsuTing))

#### Committers: 1

- Ting-Hsiang Hsu ([HsuTing](https://github.com/HsuTing))
