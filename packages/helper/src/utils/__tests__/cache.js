// @flow

import path from 'path';

import { findCacheDir } from 'find-cache-dir';
import { outputFileSync } from 'output-file-sync';

import { Cache, cacheDir } from '../cache';

describe('cache', () => {
  beforeEach(() => {
    outputFileSync.destPaths = [];
  });

  it('not find cache dir', () => {
    findCacheDir.notFindCacheDir = true;

    expect(() => {
      const cache = new Cache(true);

      cache.push('packages', ['data']);
    }).toThrow('process exit');
  });

  it('can find cache path', () => {
    const pkgPath = path.resolve(__dirname, '../../../package.json');

    findCacheDir.cachePath = pkgPath;

    const cache = new Cache(true);

    expect(cache.store).toEqual(require(pkgPath));
  });

  test.each`
    isProd   | data      | filename
    ${true}  | ${'prod'} | ${'prod.json'}
    ${false} | ${'dev'}  | ${'dev.json'}
  `(
    '$filename',
    ({
      isProd,
      data,
      filename,
    }: {
      isProd: boolean,
      data: string,
      filename: string,
    }) => {
      const cache = new Cache(isProd);

      expect(cache.store).toEqual({
        packages: [],
      });

      cache.push('packages', [data]);

      expect(cache.store).toEqual({
        packages: [data],
      });
      expect(outputFileSync.destPaths).toEqual([cacheDir(filename)]);
    },
  );
});
