# [@cat-org/configs][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/configs.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/configs
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/configs.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/configs

Use to manage the multiple configs.

## Install

```sh
yarn add @cat-org/configs --dev
```

## Run command

Depend on the first argument, `@cat-org/configs` will run the command, generate the config file and use the default option.

```sh
yarn configs babel
```

In this case, this will generate `babel.config.js` and run `babel src -d lib --verbose`.
You can also add other option to this command.

```sh
yarn configs babel -w
```

This command is equal to `babel src -d lib --verbose -w`.

```sh
yarn configs exec custom-command argumentA argumentB --configs-files babel
```

This command will generate a `babel` config when running your `custom-command`. You can also use `--configs-files babel,jest` to generate `babel` and `jest` at the same time.

#### Get the configs lint

```sh
yarn configs --info
```

#### Get the information about the config

By this option, you can get the detail of this config.

```sh
yarn configs babel --info
```

#### Download the packages from the config

```sh
yarn configs babel --install
```

In this case, this will run `yarn install @babel/cli @babel/core @cat-org/babel-plugin-base --dev`.

#### Get help

```sh
yarn configs -h
```

## Write config

This module use [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find the config file. The filename which is supported by `cosmiconfig` can be used.

```js
module.exports = {
  // configsEnv is special key, this will give to the argument of the each config function
  configsEnv: ['react'],

  // overwrite the existing config by function
  babel: config => { ... },

  // overwrite the existing config by object
  jest: {
    config: config => { ... },
  },

  // add custom config, each field is optional
  custom: {
    aliase: 'babel',             // run config with babel cli
    getCli: () => 'path-to-cli', // cli path which is used to run the command
    install: install => [        // install packages
      ...install,
      '@cat-org/configs',
    ],
    config: config => {          // write the config
      ...config,
      key: 'value',
    },
    ignore: ignore => [          // generate ignore file
      ...ignore,
      'node_modules'
    ],
    ignoreName: '.gitignore'     // ignore filename
    run: argv => [               // command to run
      ...argv,
      'src',
      '-d',
      'lib',
    ],
    env: {                       // run command with environment
      NODE_ENV: 'development',
    },
    configFiles: {               // link the config files. For example, `jest` need to run with `babel`, you need to add `babel: true`
      eslint: true,
    },
  },
};
```
