// @flow

import chalk from 'chalk';

import createLogger from '../index';
import testing from '../testing';

describe('logger', () => {
  beforeEach(() => {
    testing.reset();
    delete process.env.DEBUG;
  });

  test.each`
    debug
    ${undefined}
    ${'logger:*'}
  `(
    'could log message with process.env.DEBUG = $debug',
    ({ debug }: {| debug?: string |}) => {
      const logger = createLogger('logger:debug');

      if (debug) process.env.DEBUG = debug;
      else delete process.env.DEBUG;

      logger.start('start');
      logger.info('info');
      logger.warn('warn');
      logger.debug('debug');
      logger.log('log');
      logger.success('success');
      logger.error('error');

      expect(testing.getInstance()?.lastFrame()).toBe(chalk`{blue ⅰ }logger info
{yellow ⅰ }logger warn${
        !debug
          ? ''
          : `
  logger:debug debug`
      }
  logger log
{green ✓ }logger success
{red ✘ }logger error`);
    },
  );
});
