// @flow

import babelConfigs from '../../babel.config';
import pkgBabelConfigs from '../../packages/configs/src/babel';

describe('check babel config', () => {
  it('equal', () => {
    pkgBabelConfigs.plugins.push(
      [
        'transform-imports',
        {
          '@cat-org/utils': {
            transform: '@cat-org/utils/lib/${member}',
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
      'add-module-exports',
    );

    expect(babelConfigs).toEqual(pkgBabelConfigs);
  });
});
