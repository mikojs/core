// @flow

import chalk from 'chalk';

const { log } = console;

/**
 * @example
 * createLogger('test')
 *
 * @param {string} name - logger name
 * @param {log} logFuncOrObject - log function or log object
 * @param {object} names - names for prefix message
 *
 * @return {object} - log function object
 */
const createLogger = <T: {}>(
  name: string,
  logFuncOrObject: T,
  names?: {
    [string]: string,
  } = {
    log: chalk`{gray   {bold ${name}}}`,
    succeed: chalk`{green ✔ {bold ${name}}}`,
    fail: chalk`{red ✖ {bold ${name}}}`,
    warn: chalk`{yellow ⚠ {bold ${name}}}`,
    info: chalk`{blue ℹ {bold ${name}}}`,
  },
) =>
  [...Object.keys(names), ...Object.keys(logFuncOrObject)].reduce(
    (
      result: { [string]: (message: string) => createLogger<T> },
      key: string,
    ) => ({
      ...result,
      [key]: (
        message: string,
      ): $Call<typeof createLogger, string, T, { [string]: string }> => {
        const newLogger = (logFuncOrObject[key] || logFuncOrObject)(
          `${names[key] || names.log} ${message}`,
        );

        return createLogger(name, newLogger || logFuncOrObject, names);
      },
    }),
    ({}: { [string]: (message: string) => createLogger<T> }),
  );

export default createLogger;
