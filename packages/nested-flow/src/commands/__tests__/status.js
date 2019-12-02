// @flow

import execa from 'execa';
import chalk from 'chalk';

import status from '../status';

import testings from './__ignore__/testings';

jest.mock('readline');

describe('status', () => {
  test('first trigger', async () => {
    const mockLog = jest.fn();

    // $FlowFixMe jest mock
    process.stdout.write = mockLog;
    global.console.log = mockLog;
    (await status(['flow'], __dirname))();

    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockLog).toHaveBeenCalledWith('');
    expect(mockLog).toHaveBeenCalledWith(chalk`{reset No errors!}`);
  });

  test.each(testings)(
    'get message %s',
    (message: string, expected: ?string) => {
      const mockLog = jest.fn();

      // $FlowFixMe jest mock
      process.stdout.write = mockLog;
      execa().stdout.pipe.mock.calls[0][0].write(message);

      expect(mockLog).toHaveBeenCalledTimes(1);
      expect(mockLog).toHaveBeenCalledWith(
        expected !== null ? expected : message,
      );
    },
  );

  test('log error', async () => {
    const mockLog = jest.fn();

    // $FlowFixMe jest mock
    process.stdout.write = mockLog;
    global.console.log = mockLog;
    (await status(['flow'], __dirname))();

    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockLog).toHaveBeenCalledWith('');
    expect(mockLog).toHaveBeenCalledWith(chalk`{reset \nFound 1 errors}`);
  });
});
