// @flow

import defaultConfigs from '../index';
import withCss from '../withCss';
import withLess from '../withLess';
import withReact from '../withReact';
import withRelay from '../withRelay';
import withLerna from '../withLerna';
import withServer from '../withServer';

const configs = {
  defaultConfigs,
  withCss,
  withLess,
  withReact,
  withRelay,
  withLerna,
  withServer,
};

describe.each(
  Object.keys(configs).map((key: string) => [
    key,
    configs[key] instanceof Array ? configs[key].slice(-1)[0] : configs[key],
  ]),
)('%s', (configsKey: string, testingConfig: {}) => {
  describe.each(Object.keys(testingConfig).map((key: string) => [key]))(
    '%s',
    (configKey: string) => {
      const config =
        typeof testingConfig[configKey] === 'function'
          ? { config: testingConfig[configKey] }
          : testingConfig[configKey];

      test.each(Object.keys(config).map((key: string) => [key]))(
        '%s',
        (key: string) => {
          const value = config[key];

          switch (key) {
            case 'alias':
              expect(value).toBeTruthy();
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
