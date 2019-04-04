// @flow

// $FlowFixMe jest mock
import { fs } from 'fs';
// $FlowFixMe jest mock
import { execa } from 'execa';
import { emptyFunction } from 'fbjs';

import validateProject from '../validateProject';

jest.mock('fs');

const ctx = {
  projectDir: 'project dir',
  check: false,
};

describe('validate project', () => {
  test('project dir pass', async () => {
    fs.exist = false;
    execa.mainFunction = () => {
      const error = new Error('error');

      // eslint-disable-next-line flowtype/no-weak-types
      (error: any).stderr =
        'fatal: not a git repository (or any of the parent directories): .git';
      throw error;
    };

    expect(await validateProject(ctx)).toBeUndefined();
  });

  test('project dir exist', async () => {
    fs.exist = true;

    await expect(validateProject(ctx)).rejects.toThrow('process exit');
  });

  test('in git managed project', async () => {
    fs.exist = false;
    execa.mainFunction = emptyFunction;

    await expect(validateProject(ctx)).rejects.toThrow('process exit');
  });

  test('unexpected error', async () => {
    fs.exist = false;
    execa.mainFunction = () => {
      const error = new Error('error');

      // eslint-disable-next-line flowtype/no-weak-types
      (error: any).stderr = 'unexpected error';
      throw error;
    };

    await expect(validateProject(ctx)).rejects.toThrow('process exit');
  });
});
