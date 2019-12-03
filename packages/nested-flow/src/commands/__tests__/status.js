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
    (message: string, times: number, expected: ?string) => {
      const mockLog = jest.fn();

      // $FlowFixMe jest mock
      process.stdout.write = mockLog;
      execa().stdout.pipe.mock.calls[0][0].write(message);

      expect(mockLog).toHaveBeenCalledTimes(times);

      if (times !== 0)
        expect(mockLog).toHaveBeenCalledWith(
          expected !== null ? expected : message,
        );
    },
  );

  describe('over MAX_ERROR errors', () => {
    beforeAll(() => {
      [].constructor.apply({}, new Array(50)).map(() => {
        execa().stdout.pipe.mock.calls[0][0].write('Error --- test.js');
      });
    });

    describe.each`
      isShowAllErrors
      ${false}
      ${true}
    `(
      '--show-all-error = $isShowAllErrors',
      ({ isShowAllErrors }: {| isShowAllErrors: boolean |}) => {
        beforeEach(() => {
          execa().stdout.pipe.mockClear();
        });

        test(`${
          isShowAllErrors ? 'show' : 'not show'
        } over MAX_ERROR errors`, async () => {
          const mockLog = jest.fn();

          (
            await status(
              !isShowAllErrors ? ['flow'] : ['flow', '--show-all-errors'],
              __dirname,
            )
          )();
          // $FlowFixMe jest mock
          process.stdout.write = mockLog;

          execa().stdout.pipe.mock.calls[0][0].write('Error --- a.js');
          execa().stdout.pipe.mock.calls[0][0].write('Error --- b.js');

          if (!isShowAllErrors) expect(mockLog).toHaveBeenCalledTimes(0);
          else {
            expect(mockLog).toHaveBeenCalledTimes(2);
            expect(mockLog).toHaveBeenCalledWith('');
            expect(mockLog).toHaveBeenCalledWith(
              'Error --- packages/nested-flow/src/commands/__tests__/a.js',
            );
          }
        });

        test('log error', async () => {
          const mockLog = jest.fn();

          // $FlowFixMe jest mock
          process.stdout.write = mockLog;
          global.console.log = mockLog;
          (
            await status(
              !isShowAllErrors ? ['flow'] : ['flow', '--show-all-errors'],
              __dirname,
            )
          )();

          expect(mockLog).toHaveBeenCalledTimes(isShowAllErrors ? 2 : 1);
          expect(mockLog).toHaveBeenCalledWith(
            isShowAllErrors
              ? chalk`{reset
Found 54 errors}`
              : chalk`{reset
...3 more errors (only 50 out of 53 errors displayed)
To see all errors, re-run Flow with --show-all-errors}`,
          );
        });
      },
    );
  });
});
