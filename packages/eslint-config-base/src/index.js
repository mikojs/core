// @flow

import importConfig from './configs/import';
import flowtypeConfig from './configs/flowtype';
import jsdocConfig from './configs/jsdoc';
import reactHooks from './configs/reactHooks';
import extendsConfig from './configs/extendsConfigs';

type configType = {
  extends: $ReadOnlyArray<string>,
  plugins?: $ReadOnlyArray<string>,
  parser?: 'babel-eslint',
  env?: {|
    jest: true,
    node: true,
    browser: true,
  |},
  settings?: {
    [string]: {},
  },
  rules?: {
    [string]:
      | string
      | $ReadOnlyArray<
          | string
          | number
          | {
              [string]: mixed,
            },
        >,
  },
};

const defaultConfig = {
  extends: ['eslint:recommended'],
  parser: 'babel-eslint',
  env: {
    jest: true,
    node: true,
    browser: true,
  },
};

export default [
  defaultConfig,
  importConfig,
  flowtypeConfig,
  jsdocConfig,
  reactHooks,
  extendsConfig,
].reduce(
  (config: configType, otherConfig: configType) =>
    ['extends', 'plugins', 'parser', 'env', 'settings', 'rules'].reduce(
      (result: configType, key: string): configType => {
        switch (key) {
          case 'extends':
            return {
              ...result,
              extends: [...result.extends, ...otherConfig.extends],
            };

          case 'plugins':
            return {
              ...result,
              plugins: [
                ...(result.plugins || []),
                ...(otherConfig.plugins || []),
              ],
            };

          case 'settings':
            return {
              ...result,
              settings: {
                ...result.settings,
                // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/8243
                ...otherConfig.settings,
              },
            };

          case 'rules':
            return {
              ...result,
              rules: {
                ...result.rules,
                // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/8243
                ...otherConfig.rules,
              },
            };

          default:
            return {
              ...result,
              [key]: result[key] || otherConfig[key],
            };
        }
      },
      config,
    ),
  ({ extends: [] }: configType),
);
