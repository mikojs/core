// @flow

import { render } from 'ink-testing-library';

import createLogger, { cache } from '../index';

describe('logger', () => {
  beforeAll(() => {
    cache.render = render;
    cache.add('init', 'success', 'init');
    cache.logs = {};
  });

  test('could log message', () => {
    const logger = createLogger('logger');

    logger.success('success');
    logger.fail('fail');

    expect(cache.instance?.lastFrame()).toBe('');
  });
});
