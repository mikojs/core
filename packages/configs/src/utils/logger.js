// @flow

import logger, { findSettings } from '@cat-org/logger';

const logSettings = findSettings('log');

logSettings.fail.after = () => {
  // eslint-disable-next-line no-console
  console.error();

  if (process.env.NODE_ENV === 'test') throw new Error('process exit');

  process.exit(1);
};

export default logger('configs-scripts', logSettings);
