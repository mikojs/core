// @flow

import babelConfigs from '@cat-org/configs/lib/babel';

import rootBabelConfigs from '../babel.config';

it('check babel config', () => {
  /** handle @cat-org/root babel.config.js */
  const transformImports = rootBabelConfigs.plugins.find(
    (plugin: string | [string, {}]): boolean =>
      plugin[0] === 'transform-imports',
  );

  if (transformImports) {
    /**
     * Owing to babel.config.js can not be assigned flow type
     * $FlowFixMe
     */
    transformImports[1]['@cat-org/utils'] = {
      transform: '@cat-org/utils/lib/${member}',
    };
  }

  rootBabelConfigs.plugins.push('@cat-org/babel-plugin-transform-flow');
  rootBabelConfigs.plugins.sort();

  /** add other plugins to @cat-org/configs */
  babelConfigs.plugins.push([
    'transform-imports',
    {
      '@cat-org/utils': {
        transform: '@cat-org/utils/lib/${member}',
      },
      fbjs: {
        transform: 'fbjs/lib/${member}',
      },
    },
  ]);
  babelConfigs.plugins.sort();

  expect({
    ...rootBabelConfigs,
    overrides: [],
  }).toEqual(babelConfigs);
});
