// @flow

import miko from '../index';

import configsCache from 'utils/configsCache';

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
configsCache
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

test('miko', () => {
  expect(miko('testConfig')).toEqual({ key: 'value' });
});
