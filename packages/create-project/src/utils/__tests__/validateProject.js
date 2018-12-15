// @flow

// $FlowFixMe jest mock
import { fs } from 'fs';
import { execa } from 'execa';
import { emptyFunction } from 'fbjs';

import validateProject from '../validateProject';

jest.mock('fs');

describe('validate project', () => {
  it('project dir pass', async (): Promise<void> => {
    fs.exist = false;
    execa.mainFunction = () => {
      const error = new Error('error');

      // eslint-disable-next-line flowtype/no-weak-types
      (error: any).stderr =
        'fatal: not a git repository (or any of the parent directories): .git';
      throw error;
    };

    expect(await validateProject('project dir')).toBeUndefined();
  });

  it('project dir exist', async (): Promise<void> => {
    fs.exist = true;

    await expect(validateProject('project dir')).rejects.toThrow(
      'process exit',
    );
  });

  it('in git managed project', async (): Promise<void> => {
    fs.exist = false;
    execa.mainFunction = emptyFunction;

    await expect(validateProject('project dir')).rejects.toThrow(
      'process exit',
    );
  });

  it('unexpected error', async (): Promise<void> => {
    fs.exist = false;
    execa.mainFunction = () => {
      const error = new Error('error');

      // eslint-disable-next-line flowtype/no-weak-types
      (error: any).stderr = 'unexpected error';
      throw error;
    };

    await expect(validateProject('project dir')).rejects.toThrow(
      'process exit',
    );
  });
});
