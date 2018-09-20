// @flow

import path from 'path';

import { resetDestPaths, getDestPaths } from 'output-file-sync';
import { emptyFunction } from 'fbjs';

import generateFiles from '../generateFiles';
import configs from '../configs';
import worker from '../worker';

configs.store['not-find-cli-setting'] = emptyFunction.thatReturnsArgument;

describe('generate files', () => {
  beforeEach(() => {
    resetDestPaths();
  });

  it('error', () => {
    const mockLog = jest.fn();

    global.console.log = mockLog;

    expect(() => {
      generateFiles({ cliName: 'not-find-cli-setting' });
    }).toThrow('process exit');
    expect(mockLog).toHaveBeenCalledTimes(3);
    expect(mockLog).toHaveBeenCalledWith(
      '  {red configs-scripts} Can not generate the config file',
    );
    expect(mockLog).toHaveBeenCalledWith(
      '  {red configs-scripts} Add the path of the config in {cyan `configs.not-find-cli-setting.configFiles.not-find-cli-setting`}',
    );
  });

  it('generate', async (): Promise<void> => {
    await new Promise(resolve => {
      generateFiles({ cliName: 'jest' });

      /* eslint-disable flowtype/no-unused-expressions */
      // $FlowFixMe Flow does not yet support method or property calls in optional chains.
      worker
        .writeCache({
          pid: process.pid,
          using: false,
        })
        ?.on('end', resolve);
      /* eslint-enable flowtype/no-unused-expressions */
    });

    expect(worker.server).toBeNull();
    expect(getDestPaths()).toEqual(
      [
        'babel.config.js',
        '.prettierrc.js',
        '.eslintrc.js',
        '.eslintignore',
        'jest.config.js',
      ].map(
        (fileName: string): string => path.resolve(process.cwd(), fileName),
      ),
    );
  });
});
