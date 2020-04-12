// @flow

import path from 'path';

import configs from '../index';

describe('configs', () => {
  describe.each(Object.keys(configs).map((key: string) => [key]))(
    '%s',
    (configKey: string) => {
      const config =
        typeof configs[configKey] === 'function'
          ? { config: configs[configKey] }
          : configs[configKey];

      test.each(Object.keys(config).map((key: string) => [key]))(
        '%s',
        (key: string) => {
          const value = config[key];

          switch (key) {
            case 'alias':
              if (configKey !== 'exec') expect(value).toBeTruthy();
              else
                expect(value()).toBe(path.resolve(__dirname, '../../bin/exec'));
              break;

            case 'ignore':
              (['prettier', 'lint', 'lint:watch'].includes(configKey)
                ? expect(value().name).not
                : expect(value())
              ).toBeUndefined();
              break;

            case 'install':
            case 'run':
              expect(value([])).not.toHaveLength(0);
              break;

            case 'config':
              expect(Object.keys(value({}))).not.toBe(0);
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
