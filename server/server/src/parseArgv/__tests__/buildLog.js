// @flow

import { createLogger } from '@mikojs/utils';

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
      'server',
      createLogger('server'),
    )(data === 'done' ? data : { exists: data, filePath: './', pathname: '/' });

    expect(mockLog).toHaveBeenCalled();
  });
});
