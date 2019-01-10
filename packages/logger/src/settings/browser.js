/**
 * remove when chalk support browser
 * https://github.com/chalk/chalk/issues/300
 *
 * @flow
 */

import { type settingsType } from '../index';

const { log, error, warn, info } = console;

const CHALK_PATTERN = /(\{[a-zA-Z]* )|(\})/g;

/**
 * @example
 * transformLog(log)('meesage')
 *
 * @param {Function} logFunc - log function
 *
 * @return {Function} - log message
 */
const transformLog = (logFunc: (message: string) => void) => (
  message: string,
) => {
  const store = [];

  logFunc(
    ...[
      message.replace(CHALK_PATTERN, '%c'),
      ...(message.match(CHALK_PATTERN) || []).map(
        (pattern: string): string => {
          if (pattern === '}') return store.pop();

          const chalkText = pattern.replace(/\{([a-zA-Z]*) /, '$1');

          switch (chalkText) {
            case 'bold':
              store.push('font-weight: initial;');
              return `font-weight: ${chalkText};`;

            default:
              store.push('color: initial;');
              return `color: ${chalkText};`;
          }
        },
      ),
    ],
  );
};

export default ({
  log: {
    print: transformLog(log),
  },
  succeed: {
    print: transformLog(log),
  },
  fail: {
    print: transformLog(error),
  },
  warn: {
    print: transformLog(warn),
  },
  info: {
    print: transformLog(info),
  },
}: settingsType);
