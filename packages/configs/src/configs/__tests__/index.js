// @flow

import path from 'path';

import configs from '../index';

describe('configs', () => {
  describe.each(Object.keys(configs).map((key: string) => [key]))(
    '%s',
    (configKey: string) => {
      const config = configs[configKey];

      test.each(Object.keys(config).map((key: string) => [key]))(
        '%s',
        (key: string) => {
          const value = config[key];

          switch (key) {
            case 'alias':
            case 'ignoreName':
              expect(value).toBeTruthy();
              break;

            case 'install':
            case 'ignore':
            case 'run':
              (configKey === 'exec' ||
              (configKey === 'flow-typed:lerna' && key === 'run')
                ? expect(value([]))
                : expect(value([])).not
              ).toHaveLength(0);
              break;

            case 'config':
              expect(Object.keys(value({ configsEnv: [] }))).not.toBe(0);
              break;

            case 'getCli':
              expect(value([configKey, 'babel'])).toBe(
                path.resolve('./node_modules/.bin/babel'),
              );
              break;

            case 'env':
            case 'configsFiles':
              expect(Object.keys(value)).not.toBe(0);
              break;

            default:
              expect(value).toBeUndefined();
              break;
          }
        },
      );
    },
  );
});
