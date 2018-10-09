// @flow

import chalk from 'chalk';

import logger from '@cat-org/logger';

export default logger(
  chalk`helper {bold {gray [${process.env.RUN_ENV || 'dev'}]}}`,
  () => {
    // eslint-disable-next-line no-console
    console.error();

    if (process.env.NODE_ENV === 'test') throw new Error('process exit');

    process.exit(1);
  },
);
