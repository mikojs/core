// @flow

import importConfig from './import';
import flowtypeConfig from './flowtype';
import jsdocConfig from './jsdoc';
import extendsConfig from './extendsConfigs';

import type { configType } from './definitions/configType.js.flow';

const defaultConfig = {
  extends: ['eslint:recommended'],
  parser: 'babel-eslint',
  env: {
    jest: true,
    node: true,
    browser: true,
  },
};

const configs = [
  defaultConfig,
  importConfig,
  flowtypeConfig,
  jsdocConfig,
  extendsConfig,
].reduce(
  (newConfig: configType, otherConfig: configType): configType =>
    Object.keys({ ...newConfig, ...otherConfig }).reduce(
      (config: configType, key: string): configType => {
        switch (key) {
          case 'extends':
          case 'plugins':
            return {
              ...config,
              [key]: [...(newConfig[key] || []), ...(otherConfig[key] || [])],
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
      },
      {},
    ),
  ({}: configType),
);

export default configs;
