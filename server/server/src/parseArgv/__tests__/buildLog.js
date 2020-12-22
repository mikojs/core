// @flow

import createLogger from '@mikojs/logger';
import testing from '@mikojs/logger/lib/testing';

import buildLog from '../buildLog';

describe('build log', () => {
  beforeEach(() => {
    testing.reset();
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

    expect(testing.getInstance()?.lastFrame()).not.toBe('');
  });
});
