// @flow

import { mockChoice } from '@mikojs/utils';

import { type settingsType } from '../index';

const { log, error, warn, info } = console;

export default ({
  log,
  succeed: log,
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
  warn,
  info,
}: settingsType);
