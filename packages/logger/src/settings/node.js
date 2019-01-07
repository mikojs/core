// @flow

import { mockChoice } from '@cat-org/utils';

import { type settingsType } from '..';

const { log, error, warn, info } = console;

export default ({
  log: {
    print: log,
  },
  succeed: {
    print: log,
  },
  fail: {
    print: error,
    after: () => {
      error();
      mockChoice(
        process.env.NODE_ENV === 'test',
        () => {
          throw new Error('process exit');
        },
        process.exit,
        1,
      );
    },
  },
  warn: {
    print: warn,
  },
  info: {
    print: info,
  },
}: settingsType);
