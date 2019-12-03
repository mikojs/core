// @flow

import envinfo from 'envinfo';
import execa from 'execa';

import install from '../install';

describe('install', () => {
  beforeEach(() => {
    execa.mockClear();
    envinfo.run.mockClear();
  });

  test.each`
    flowVersion                   | flowBinVersion
    ${[]}                         | ${undefined}
    ${[]}                         | ${'1.0.0'}
    ${['-f', '1.0.0']}            | ${undefined}
    ${['--flowVersion', '1.0.0']} | ${undefined}
  `(
    'Run command with flow version = $flowVersion, flow bin version = $flowBinVersion',
    async ({
      flowVersion,
      flowBinVersion,
    }: {|
      flowVersion: $ReadOnlyArray<string>,
      flowBinVersion: ?string,
    |}) => {
      const mockLog = jest.fn();

      // $FlowFixMe jest mock
      process.stdout.write = mockLog;
      envinfo.run.mockResolvedValue(
        JSON.stringify({
          npmPackages: {
            'flow-bin': !flowBinVersion
              ? undefined
              : {
                  wanted: flowBinVersion,
                },
          },
        }),
      );
      await install(['flow-typed', 'install', ...flowVersion], __dirname);
      execa().stdout.pipe.mock.calls[0][0].write('flow-typed/npm/test.js');

      expect(execa).toHaveBeenCalledWith(
        'flow-typed',
        [
          'install',
          ...(flowVersion.length === 0 && !flowBinVersion
            ? []
            : [
                flowVersion.includes('--flowVersion') ? '--flowVersion' : '-f',
                '1.0.0',
              ]),
        ],
        {
          cwd: __dirname,
        },
      );
      expect(mockLog).toHaveBeenCalledWith(
        'packages/nested-flow/src/commands/flowTyped/__tests__/flow-typed/npm/test.js',
      );
    },
  );
});
