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
    after: (): Error | void => {
      error();

      return mockChoice(
        process.env.NODE_ENV === 'test',
        () => new Error('process exit'),
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
