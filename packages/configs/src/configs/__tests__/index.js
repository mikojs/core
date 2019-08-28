// @flow

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
              expect(value([]).length).not.toBe(0);
              return;

            case 'config':
              expect(Object.keys(value({ configsEnv: [] }))).not.toBe(0);
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
  });
});
