// @flow

import path from 'path';

import configs from '../index';

describe('configs', () => {
  Object.keys(configs).forEach((configKey: string) => {
    const config = configs[configKey];

    describe(configKey, () => {
      Object.keys(config).forEach((key: string) => {
        const value = config[key];

        test(key, () => {
          switch (key) {
            case 'alias':
            case 'ignoreName':
              expect(value).toBeTruthy();
              return;

            case 'install':
            case 'ignore':
            case 'run':
              (configKey === 'exec' ||
              (configKey === 'flow-typed:lerna' && key === 'run')
                ? expect(value([]))
                : expect(value([])).not
              ).toHaveLength(0);
              return;

            case 'config':
              expect(Object.keys(value({ configsEnv: [] }))).not.toBe(0);
              return;

            case 'getCli':
              expect(value([configKey, 'babel'])).toBe(
                path.resolve('./node_modules/.bin/babel'),
              );
              return;

            case 'env':
            case 'configsFiles':
              expect(Object.keys(value)).not.toBe(0);
              return;

            default:
              expect(value).toBeUndefined();
              return;
          }
        });
      });
    });
  });
});
