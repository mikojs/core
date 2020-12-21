// @flow

import createLogger from '@mikojs/logger';

import buildLog from '../buildLog';

describe('build log', () => {
  test.each`
    data
    ${'done'}
    ${true}
    ${false}
  `('run with data = $data', ({ data }: {| data: 'done' | boolean |}) => {
    const mockLog = jest.fn();

    global.console = {
      log: mockLog,
      info: mockLog,
    };
    buildLog(
      data === 'done' ? data : 'update',
      'server',
      createLogger('server'),
    )({ exists: Boolean(data), filePath: './', pathname: '/' });

    expect(mockLog).toHaveBeenCalled();
  });
});
