// @flow

import type { settingsType } from '../logger';

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
  },
  warn: {
    print: warn,
  },
  info: {
    print: info,
  },
}: settingsType);
