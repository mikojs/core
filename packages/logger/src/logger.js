// @flow

import chalk from 'chalk';

const logger = {
  log: (message: string): typeof logger => {
    const { log } = console;

    log(chalk`{gray   }${message}`);

    return logger;
  },
  succeed: (message: string): typeof logger => {
    const { log } = console;

    log(chalk`{green ✔ }${message}`);

    return logger;
  },
  fail: (message: string): typeof logger => {
    const { error } = console;

    error(chalk`{red ✖ }${message}`);

    return logger;
  },
  warn: (message: string): typeof logger => {
    const { warn } = console;

    warn(chalk`{yellow ⚠ }${message}`);

    return logger;
  },
  info: (message: string): typeof logger => {
    const { info } = console;

    info(chalk`{blue ℹ }${message}`);

    return logger;
  },
};

export default logger;
