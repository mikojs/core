// @flow

/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable jsdoc/require-jsdoc */

/* eslint-disable import/no-extraneous-dependencies */
const defaultConfigs = require('@mikojs/configs');
/* eslint-enable import/no-extraneous-dependencies */

const extendConfigs = require('./.catrc');

const migrateConfigs = configs =>
  Object.keys(configs).reduce((result, key) => {
    switch (key) {
      case 'lint:watch':
      case 'test':
        return result;

      default: {
        const config = configs[key];
        const output = typeof config === 'function' ? config : {};

        if (config.config) output.config = config.config;

        if (config.ignore)
          output.ignore = ignore => config.ignore({ ignore }).ignore || [];

        if (config.filenames) output.filenames = config.filenames;

        return {
          ...result,
          [key]: output,
        };
      }
    }
  }, {});

const miko = ({ clean, ...config }) => ({
  ...config,
  clean: {
    ...clean,
    command: clean.command.replace(
      / \.flowconfig'/,
      `' && lerna exec 'rm -rf .flowconfig' --ignore ${[
        '@mikojs/eslint-config-base',
        '@mikojs/miko',
        '@mikojs/koa-react',
        '@mikojs/koa-graphql',
        '@mikojs/use-css',
        '@mikojs/use-less',
        '@mikojs/website',
      ].join(' --ignore ')}`,
    ),
  },
});

module.exports = [
  {
    babel: {
      filenames: {
        config: 'babel.config.js',
      },
    },
    jest: {
      filenames: {
        config: 'jest.config.js',
      },
    },
    lint: {
      filenames: {
        config: '.eslintrc.js',
        ignore: '.eslintignore',
      },
    },
    prettier: {
      filenames: {
        config: '.prettierrc.js',
        ignore: '.prettierignore',
      },
    },
    'lint-staged': {
      filenames: {
        config: '.lintstagedrc.js',
      },
    },
  },
  defaultConfigs,
  ...extendConfigs,
  {
    miko,
  },
].map(config =>
  config instanceof Array ? config.map(migrateConfigs) : migrateConfigs(config),
);
