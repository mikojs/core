// @flow

import buildChokidar, { removeFileCache } from '../buildChokidar';

describe('build chokidar', () => {
  test('run', async () => {
    const chokidar = buildChokidar();

    chokidar.on('add', jest.fn()).add('pathOne').add('pathTwo');

    expect(chokidar.run()).toBeUndefined();
    expect(await chokidar.watcher()?.close()).toBeUndefined();
  });

  test.each`
    filePath
    ${'test'}
    ${'test.js'}
  `('remove file cache', ({ filePath }: {| filePath: string |}) => {
    expect(removeFileCache(filePath)).toBeUndefined();
  });
});
