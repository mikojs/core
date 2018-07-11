// @flow
//
import babelConfigs from '@cat-org/configs/lib/babel';

import rootBabelConfigs from '../../babel.config';

describe('check babel config', () => {
  it('equal', () => {
    babelConfigs.plugins.push(
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

    expect(rootBabelConfigs).toEqual(babelConfigs);
  });
});
