// @flow

import fs from 'fs';
import path from 'path';

import rimraf from 'rimraf';
import mkdirp from 'mkdirp';
import copyDir from 'copy-dir';

import flowTypedCache, { cacheDir } from '../flowTypedCache';

jest.mock('fs');

describe('flowTypedCache', () => {
  beforeEach(() => {
    rimraf.mockClear();
    mkdirp.sync.mockClear();
    copyDir.sync.mockClear();
  });

  test.each`
    restore
    ${false}
    ${true}
  `('restore = $restore', async ({ restore }: {| restore: boolean |}) => {
    const cacheFolder = cacheDir('@mikojs/core');
    const packageFodler = path.resolve('./flow-typed/npm');

    // $FlowFixMe jest mock
    fs.existsSync.mockImplementation(
      (filePath: string) => !/__mocks__/.test(filePath),
    );

    expect(await flowTypedCache(restore)).toBeUndefined();
    expect(rimraf).toHaveBeenCalledTimes(1);
    expect(rimraf.mock.calls[0][0]).toBe(restore ? packageFodler : cacheFolder);

    if (restore) {
      expect(mkdirp.sync).toHaveBeenCalledTimes(2);
      expect(mkdirp.sync).toHaveBeenCalledWith(packageFodler);
      expect(mkdirp.sync).toHaveBeenCalledWith(
        path.resolve('./__mocks__/@lerna/flow-typed/npm'),
      );

      expect(copyDir.sync).toHaveBeenCalledTimes(2);
      expect(copyDir.sync).toHaveBeenCalledWith(
        cacheDir('@mikojs/test'),
        path.resolve('./__mocks__/@lerna/flow-typed/npm'),
      );
      expect(copyDir.sync).toHaveBeenCalledWith(
        cacheFolder,
        path.resolve('./flow-typed/npm'),
      );
    } else {
      expect(mkdirp.sync).toHaveBeenCalledTimes(1);
      expect(mkdirp.sync).toHaveBeenCalledWith(cacheFolder);

      expect(copyDir.sync).toHaveBeenCalledTimes(1);
      expect(copyDir.sync).toHaveBeenCalledWith(packageFodler, cacheFolder);
    }
  });

  test('could not restore cache when not found', async () => {
    fs.existsSync.mockReturnValue(false);

    expect(await flowTypedCache(true));
    expect(rimraf).not.toHaveBeenCalled();
    expect(mkdirp.sync).not.toHaveBeenCalled();
    expect(copyDir.sync).not.toHaveBeenCalled();
  });
});
