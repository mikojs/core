// @flow

import defaultConfigs from '../index';
import withReact from '../withReact';
import withRelay from '../withRelay';
import withLerna from '../withLerna';

const configs = {
  defaultConfigs,
  withReact,
  withRelay,
  withLerna,
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
            case 'config':
              expect(Object.keys(value({}))).not.toBe(0);
              break;

            case 'filename':
              expect(value).not.toBeUndefined();
              break;

            default:
              expect(value.config).not.toBeUndefined();
              break;
          }
        },
      );
    },
  );
});
