// @flow

import chalk from 'chalk';

import chainingLogger from './chainingLogger';

/**
 * @example
 * createLogger('test')
 *
 * @param {string} name - logger name
 * @param {object} logger - logger function
 * @param {object} names - logger names mapping
 *
 * @return {object} - logger object
 */
const createLogger = (
  name: string,
  logger: typeof chainingLogger = chainingLogger,
  names: { [string]: string } = {
    log: chalk`{gray {bold ${name}}}`,
    start: chalk`{gray {bold ${name}}}`,
    succeed: chalk`{green {bold ${name}}}`,
    fail: chalk`{red {bold ${name}}}`,
    warn: chalk`{yellow {bold ${name}}}`,
    info: chalk`{blue {bold ${name}}}`,
  },
): {
  [string]: (
    message: string,
  ) => $Call<typeof createLogger, string, typeof chainingLogger>,
} =>
  Object.keys(names).reduce(
    (result: {}, key: string) => ({
      ...result,
      [key]: (
        message: string,
      ): $Call<typeof createLogger, string, typeof chainingLogger> => {
        if (logger[key])
          return createLogger(
            name,
            logger[key](`${names[key]} ${message}`),
            names,
          );

        chainingLogger.log(`${names[key]} ${message}`);

        return createLogger(name, logger, names);
      },
    }),
    {},
  );

export default createLogger;
