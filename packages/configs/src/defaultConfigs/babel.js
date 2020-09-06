// @flow

import { mockChoice } from '@mikojs/utils';

export default {
  filenames: {
    config: 'babel.config.js',
  },

  /**
   * @return {object} - babel config
   */
  config: () => ({
    presets: ['@mikojs/base'],
    ignore: mockChoice(
      process.env.NODE_ENV === 'test',
      [],
      ['**/__tests__/**', '**/__mocks__/**'],
    ),
  }),
};
