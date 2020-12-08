// @flow

import { render } from 'ink-testing-library';

import createLogger from '../index';

test('logger', () => {
  const logger = createLogger('logger');
  const { lastFrame } = render(logger.dom);

  expect(lastFrame()).toBe('Hello world');
});
