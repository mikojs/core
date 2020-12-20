// @flow

import { render } from 'ink-testing-library';

import createLogger, { cache } from '../index';

describe('logger', () => {
  beforeAll(() => {
    cache.render = render;
    cache.messages = [];
  });

  test('could log message', () => {
    const logger = createLogger('logger');

    logger.success('success');
    logger.error('error');

    expect(cache.instance?.lastFrame()).toBe('');
  });
});
