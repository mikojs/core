# [@mikojs/configs][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@mikojs/configs.svg
[npm-link]: https://www.npmjs.com/package/@mikojs/configs
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@mikojs/configs.svg

<!-- badges.end -->

[website]: https://mikojs.github.io/core/configs

Use to manage the multiple configs.

## Install

```sh
yarn add @mikojs/configs --dev
```

## Run command

Depend on the first argument, `@mikojs/configs` will run the command, generate the config file and use the default option.

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
yarn configs info
```

#### Get the information about the config

By this option, you can get the detail of this config.

```sh
yarn configs info babel
```

#### Download the packages from the config

```sh
yarn configs install babel
```

In this case, this will run `yarn install @babel/cli @babel/core ... --dev`.

#### Clean the files

If `@mikojs/configs` has crashed, you want to remove the files. You can use:

```sh
yarn configs remove babel
```

#### Get help

```sh
yarn configs -h
```

## Write config

This module use [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find the config file. The filename which is supported by `cosmiconfig` can be used.

```js
module.exports = {
  // overwrite the existing config by function
  babel: config => { ... },

  // overwrite the existing config by object
  jest: {
    config: config => { ... },
  },

  // add custom config, each field is optional
  custom: {
    alias: 'babel',               // run config with babel cli
    // or
    alias: argv => 'path-to-cli', // cli path which is used to run the command

    install: install => [         // install packages
      ...install,
      '@mikojs/configs',
    ],
    config: config => {           // write the config
      ...config,
      key: 'value',
    },
    ignore: ignore => {           // generate ignore file
      name: '.gitignore',
      ignore: [
        ...ignore.ignore,
        'node_modules',
      ],
    },
    run: argv => [                // command to run
      ...argv,
      'src',
      '-d',
      'lib',
    ],
    env: {                        // run command with environment
      NODE_ENV: 'development',
    },
    configsFiles: {               // link the config files. For example, `jest` need to run with `babel`, you need to add `babel: true`
      eslint: true,
    },
  },
};
```
