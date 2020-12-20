// @flow

import { render } from 'ink-testing-library';
import chalk from 'chalk';

import createLogger, { cache } from '../index';

describe('logger', () => {
  beforeAll(() => {
    cache.render = render;
    cache.messages = [];
  });

  test('could log message', () => {
    const logger = createLogger('logger');

    logger.start('start');
    logger.info('info');
    logger.warn('warn');
    logger.log('log');
    logger.success('success');
    logger.error('error');

    expect(cache.instance?.lastFrame()).toBe(chalk`{blue ⅰ }logger info
{yellow ⅰ }logger warn
  logger log
{green ✓ }logger success
{red ✘ }logger error`);
  });
});
