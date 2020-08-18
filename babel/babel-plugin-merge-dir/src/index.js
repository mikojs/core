// @flow

import nodePath from 'path';

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
    const cacheFilePath = nodePath.resolve(dir, './.mergeDir');
    const cache = {};

    assertVersion(7);

    return {
      visitor: {
        Identifier: (
          path: nodePathType,
          {
            file: {
              opts: { filename },
            },
          }: {|
            file: {|
              opts: {| filename: string |},
            |},
          |},
        ) => {
          if (
            !t.isIdentifier(path.node, { name: 'require' }) ||
            !t.isCallExpression(path.parentPath.node)
          )
            return;

          const modulePath = nodePath.resolve(
            nodePath.dirname(filename),
            path.parentPath.get('arguments.0').node.value,
          );

          if (modulePath !== dir) return;

          path.parentPath.replaceWith(
            t.callExpression(path.node, [
              t.stringLiteral(
                nodePath.relative(nodePath.dirname(filename), cacheFilePath),
              ),
            ]),
          );
        },
      },
      post: ({
        opts: { filename },
      }: {|
        opts: {|
          filename: string,
        |},
      |}) => {
        if (!filename.includes(dir) || !callback) return;

        cache[filename] = nodePath.relative(dir, filename);
        outputFileSync(cacheFilePath, callback(Object.values(cache[filename])));
      },
    };
  },
);
