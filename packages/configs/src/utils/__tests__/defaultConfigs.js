// @flow

import defaultConfigs from '../defaultConfigs';

describe('default config', () => {
  Object.entries(defaultConfigs).forEach(
    ([configKey, config]: [string, {}]) => {
      describe(configKey, () => {
        Object.entries(config).forEach(([key, value]: [string, mixed]) => {
          it(key, () => {
            switch (key) {
              case 'alias':
              case 'ignoreName':
                expect(value).toBeTruthy();
                return;

              case 'install':
              case 'ignore':
              case 'run':
                expect(value([]).length).not.toBe(0);
                return;

              case 'config':
                expect(Object.keys(value())).not.toBe(0);
                return;

              case 'env':
              case 'configFiles':
                expect(Object.keys(value)).not.toBe(0);
                return;

              default:
                expect(value).toBeUndefined();
                return;
            }
          });
        });
      });
    },
  );
});
