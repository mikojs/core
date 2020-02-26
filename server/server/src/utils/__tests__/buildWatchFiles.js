// @flow

import chokidar from 'chokidar';

import buildWatchFiles, { removeFileCache } from '../buildWatchFiles';

describe('build watch files', () => {
  test('run', () => {
    const watchFiles = buildWatchFiles();
    const mockCallback = jest.fn();

    watchFiles.init(__dirname).on('add', mockCallback);
    watchFiles.run();

    expect(chokidar.watch().on).toHaveBeenCalledWith('add', mockCallback);
  });

  test.each`
    filePath
    ${'test'}
    ${'test.js'}
  `('remove file cache', ({ filePath }: {| filePath: string |}) => {
    expect(removeFileCache(filePath)).toBeUndefined();
  });
});
