// @flow

import importResolver from './importResolver';
import flowtype from './flowtype';
import jsdoc from './jsdoc';
import extendsConfig from './extendsConfigs';

type configType = {
  extends?: $ReadOnlyArray<string>,
  parser?: 'babel-eslint',
  env?: {
    jest: true,
    node: true,
    browser: true,
  },
  plugins?: $ReadOnlyArray<string>,
  settings?: {
    [string]: {},
  },
  rules?: {
    [string]: string | $ReadOnlyArray<string | number | {
      [string]: mixed,
    }>,
  },
};

const defaultConfig = {
  extends: [
    'eslint:recommended',
  ],
  parser: 'babel-eslint',
  env: {
    jest: true,
    node: true,
    browser: true,
  },
};

const configs = [
  defaultConfig,
  importResolver,
  flowtype,
  jsdoc,
  extendsConfig,
].reduce((newConfig: configType, otherConfig: configType): configType => (
  Object.keys({ ...newConfig, ...otherConfig })
    .reduce((config: configType, key: string): configType => {
      switch (key) {
        case 'extends':
        case 'plugins':
          return {
            ...config,
            [key]: [
              ...(newConfig[key] || []),
              ...(otherConfig[key] || []),
            ],
          };

        case 'settings':
        case 'rules':
          return {
            ...config,
            [key]: {
              ...newConfig[key],
              ...otherConfig[key],
            },
          };

        default:
          return {
            ...config,
            [key]: newConfig[key] || otherConfig[key],
          };
      }
    }, {})
), {});

export default configs;
