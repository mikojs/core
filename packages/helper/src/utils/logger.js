// @flow

import logger from '@cat-org/logger';

export default logger('helper', () => {
  // eslint-disable-next-line no-console
  console.error();

  if (process.env.NODE_ENV === 'test') throw new Error('process exit');

  process.exit(1);
});
