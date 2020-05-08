// @flow

import path from 'path';

import chokidar from 'chokidar';

import mergeDir, {
  type mergeDirEventType,
  type mergeDirDataType,
} from '../mergeDir';

const { on: mockCallback } = chokidar.watch('/');

describe('merge dir', () => {
  beforeEach(() => {
    mockCallback.mockClear();
  });

  test.each`
    watch
    ${true}
    ${false}
  `('merge dir with watch = $watch', ({ watch }: {| watch: boolean |}) => {
    const cache = {};

    mergeDir(
      path.resolve(__dirname, './__ignore__/mergeDir'),
      { watch },
      (event: mergeDirEventType, { name }: mergeDirDataType) => {
        if (!cache[event]) cache[event] = [];

        cache[event].push(name);
      },
    );

    if (watch) mockCallback.mock.calls[0][1]('add', '/c.js');

    expect(cache).toEqual({
      init: ['a.js', 'b.js'],
      ...(!watch
        ? {}
        : {
            add: ['c.js'],
          }),
    });
  });
});
