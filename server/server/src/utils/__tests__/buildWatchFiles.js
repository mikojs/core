// @flow

import chokidar from 'chokidar';

import buildWatchFiles from '../buildWatchFiles';

describe('build watch files', () => {
  test('run', () => {
    const watchFiles = buildWatchFiles();
    const mockCallback = jest.fn();

    watchFiles.init(__dirname).on('add', mockCallback);
    watchFiles.run();

    expect(chokidar.watch().on).toHaveBeenCalledWith('add', mockCallback);
  });
});
