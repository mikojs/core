// @flow

import fs from 'fs';
import path from 'path';

import envinfo from 'envinfo';
import execa from 'execa';

import { requireModule } from '@mikojs/utils';

import install from '../install';

import findFlowDirs from 'utils/findFlowDirs';

jest.mock('fs');
jest.mock('@mikojs/utils/lib/requireModule', () => jest.fn());
jest.mock('utils/findFlowDirs', () => jest.fn());

// $FlowFixMe jest mock
findFlowDirs.mockReturnValue(
  jest.requireActual('../../../utils/findFlowDirs')(
    path.resolve(__dirname, '../../../utils/__tests__/__ignore__'),
    false,
  ),
);
// $FlowFixMe jest mock
fs.existsSync.mockImplementation(jest.requireActual('fs').existsSync);

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

  test('link flow-typed and run command failed', async () => {
    const mockLog = jest.fn();
    const mockResult: Promise<void> & {
      stdout?: {},
      stderr?: {},
    } = Promise.reject(new Error('error'));

    global.console.log = mockLog;
    // $FlowFixMe jest mock
    requireModule.mockReturnValue({
      dependencies: {
        '@mikojs/test-module': 'version',
      },
      devDependencies: {
        'test-file.js': 'version',
      },
    });
    mockResult.stdout = {
      pipe: jest.fn(),
    };
    mockResult.stderr = {
      pipe: jest.fn(),
    };
    execa.mockImplementation(() => mockResult);

    const endFunc = await install(['flow-typed', 'install'], __dirname);

    expect(endFunc()).toBeTruthy();
    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(fs.symlinkSync).toHaveBeenCalledTimes(4);
  });
});
