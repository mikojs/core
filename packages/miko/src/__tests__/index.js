// @flow

import miko from '../index';

import cache from 'utils/cache';

const config = {
  testConfig: {
    filenames: {
      config: 'testConfig.config.js',
    },
    /**
     * @return {object} - config object
     */
    config: () => ({ key: 'value' }),
  },
};

jest.mock('@mikojs/worker', () =>
  jest.fn().mockResolvedValue(jest.requireActual('../worker')),
);
cache
  .load()
  .load({
    filepath: __filename,
    config,
  })
  .load({
    filepath: __filename,
    config: [
      {
        ...config,
        testConfig: config.testConfig.config,
      },
      [
        {
          ...config,
          testConfig: {},
        },
      ],
    ],
  });

describe('miko', () => {
  test.each`
    configName      | expected
    ${'testConfig'} | ${{ key: 'value' }}
    ${'notExist'}   | ${{}}
  `(
    'get config from $configName',
    ({ configName, expected }: {| configName: string, expected: {} |}) => {
      expect(miko(configName)).toEqual(expected);
    },
  );
});
