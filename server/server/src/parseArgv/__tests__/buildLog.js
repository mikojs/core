// @flow

import createLogger from '@mikojs/logger';
import testingLogger from '@mikojs/logger/lib/testingLogger';

import buildLog from '../buildLog';

describe('build log', () => {
  beforeEach(() => {
    testingLogger.reset();
  });

  test.each`
    data
    ${'done'}
    ${true}
    ${false}
  `('run with data = $data', ({ data }: {| data: 'done' | boolean |}) => {
    buildLog(
      data === 'done' ? data : 'update',
      'server',
      createLogger('server'),
    )({ exists: Boolean(data), filePath: './', pathname: '/' });

    expect(testingLogger.getInstance()?.lastFrame()).not.toBe('');
  });
});
