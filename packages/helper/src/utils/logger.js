// @flow

import logger, { findSettings } from '@cat-org/logger';

const oraSettings = findSettings('ora');

oraSettings.fail.after = () => {
  // eslint-disable-next-line no-console
  console.error();

  if (process.env.NODE_ENV === 'test') throw new Error('process exit');

  process.exit(1);
};

export default logger('helper', oraSettings).init();
