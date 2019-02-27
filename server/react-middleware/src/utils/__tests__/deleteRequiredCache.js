// @flow

import { watchCallback } from 'chokidar';

import deleteRequiredCache from '../deleteRequiredCache';

describe('delete required cache', () => {
  beforeAll(() => {
    deleteRequiredCache(__dirname);
  });

  test.each`
    filePath
    ${'index'}
    ${'index.js'}
  `('$filePath', ({ filePath }: { filePath: string }) => {
    watchCallback(filePath);
  });
});
