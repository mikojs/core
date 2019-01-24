// @flow

import jest, { config } from './index';

export default {
  ...jest,
  alias: 'jest',
  config: () => ({
    ...config,
    setupFiles: [...config.setupFiles, '@cat-org/jest/lib/react'],
  }),
};
