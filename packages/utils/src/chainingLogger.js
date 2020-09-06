// @flow

import chalk from 'chalk';

const chainingLogger = {
  /**
   * @param {string} message - logger message
   *
   * @return {chainingLogger} - chaing logger object
   */
  log: (message: string): typeof chainingLogger => {
    const { log } = console;

    log(chalk`{gray   }${message}`);

    return chainingLogger;
  },

  /**
   * @param {string} message - logger message
   *
   * @return {chainingLogger} - chaing logger object
   */
  succeed: (message: string): typeof chainingLogger => {
    const { log } = console;

    log(chalk`{green ✔ }${message}`);

    return chainingLogger;
  },

  /**
   * @param {string} message - logger message
   *
   * @return {chainingLogger} - chaing logger object
   */
  fail: (message: string): typeof chainingLogger => {
    const { error } = console;

    error(chalk`{red ✖ }${message}`);

    return chainingLogger;
  },

  /**
   * @param {string} message - logger message
   *
   * @return {chainingLogger} - chaing logger object
   */
  warn: (message: string): typeof chainingLogger => {
    const { warn } = console;

    warn(chalk`{yellow ⚠ }${message}`);

    return chainingLogger;
  },

  /**
   * @param {string} message - logger message
   *
   * @return {chainingLogger} - chaing logger object
   */
  info: (message: string): typeof chainingLogger => {
    const { info } = console;

    info(chalk`{blue ℹ }${message}`);

    return chainingLogger;
  },
};

export default chainingLogger;
