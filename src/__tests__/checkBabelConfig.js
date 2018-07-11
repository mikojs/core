// @flow

import babelConfigs from '@cat-org/configs/lib/babel';

import rootBabelConfigs from '../../babel.config';

describe('check babel config', () => {
  it('equal', () => {
    // $FlowFixMe
    rootBabelConfigs.plugins.find(
      (plugin: string | $ReadOnlyArray<string | {}>): boolean =>
        plugin[0] === 'transform-imports',
    )[1]['@cat-org/utils'] = {
      transform: '@cat-org/utils/lib/utils',
    };

    babelConfigs.plugins.push(
      [
        'transform-imports',
        {
          '@cat-org/utils': {
            transform: '@cat-org/utils/lib/utils',
          },
          fbjs: {
            transform: 'fbjs/lib/${member}',
          },
        },
      ],
      [
        'module-resolver',
        {
          root: ['./src'],
        },
      ],
    );

    expect({
      ...rootBabelConfigs,
      overrides: [],
    }).toEqual(babelConfigs);
  });
});
