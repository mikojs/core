// @flow

import typeof chalkType from 'chalk';

import requireModule from './requireModule';

const chalk: chalkType = requireModule('chalk');
const chainingLogger = {
  log: (message: string): typeof chainingLogger => {
    const { log } = console;

    log(chalk`{gray   }${message}`);

    return chainingLogger;
  },
  succeed: (message: string): typeof chainingLogger => {
    const { log } = console;

    log(chalk`{green ✔ }${message}`);

    return chainingLogger;
  },
  fail: (message: string): typeof chainingLogger => {
    const { error } = console;

    error(chalk`{red ✖ }${message}`);

    return chainingLogger;
  },
  warn: (message: string): typeof chainingLogger => {
    const { warn } = console;

    warn(chalk`{yellow ⚠ }${message}`);

    return chainingLogger;
  },
  info: (message: string): typeof chainingLogger => {
    const { info } = console;

    info(chalk`{blue ℹ }${message}`);

    return chainingLogger;
  },
};

export default chainingLogger;
