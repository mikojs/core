// @flow

import path from 'path';

import mergeDir, {
  mockUpdate,
  type mergeDirEventType,
  type mergeDirDataType,
} from '../mergeDir';

describe('merge dir', () => {
  beforeEach(() => {
    mockUpdate.clear();
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

    if (watch) {
      expect(mockUpdate.cache).toHaveLength(1);
      mockUpdate.cache[0]('add', '/c.js');
    }

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
