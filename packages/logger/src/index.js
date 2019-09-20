// @flow

import chalk from 'chalk';

import logger from './logger';

/**
 * @example
 * createLogger('test')
 *
 * @param {string} name - logger name
 * @param {object} logFunc - logger function object
 * @param {object} names - logger names mapping
 *
 * @return {object} - logger object
 */
const createLogger = (
  name: string,
  logFunc: {} = logger,
  names: { [string]: string } = {
    log: chalk`{gray {bold ${name}}}`,
    start: chalk`{gray {bold ${name}}}`,
    succeed: chalk`{green {bold ${name}}}`,
    fail: chalk`{red {bold ${name}}}`,
    warn: chalk`{yellow {bold ${name}}}`,
    info: chalk`{blue {bold ${name}}}`,
  },
): {
  [string]: (message: string) => $Call<typeof createLogger, string, {}>,
} =>
  Object.keys(names).reduce(
    (result: {}, key: string) => ({
      ...result,
      [key]: (message: string): $Call<typeof createLogger, string, {}> => {
        (logFunc[key] || logger.log)(`${names[key]} ${message}`);

        return createLogger(name, logFunc);
      },
    }),
    {},
  );

export default createLogger;
