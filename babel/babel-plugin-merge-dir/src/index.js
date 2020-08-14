// @flow

import path from 'path';

import { declare } from '@babel/helper-plugin-utils';
import type nodePathType from '@babel/traverse';
import outputFileSync from 'output-file-sync';

export default declare(
  (
    { assertVersion, types: t }: nodePathType,
    {
      dir = '.',
      callback,
    }: {|
      dir?: string,
      callback: (filenames: $ReadOnlyArray<string>) => string,
    |},
  ): {} => {
    const cacheFilePath = path.resolve(dir, './.mergeDir');
    const cache = {};

    assertVersion(7);

    return {
      post: ({
        opts: { filename },
      }: {|
        opts: {|
          filename: string,
        |},
      |}) => {
        if (!filename.includes(dir) || !callback) return;

        cache[filename] = `./${path.relative(dir, filename)}`;
        outputFileSync(cacheFilePath, callback(Object.values(cache[filename])));
      },
    };
  },
);
