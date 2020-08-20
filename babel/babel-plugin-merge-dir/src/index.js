// @flow

import nodePath from 'path';

import { declare } from '@babel/helper-plugin-utils';
import type nodePathType from '@babel/traverse';
import outputFileSync from 'output-file-sync';

import { d3DirTree } from '@mikojs/utils';
import {
  type d3DirTreeNodeType,
  type d3DirTreeOptionsType,
} from '@mikojs/utils/lib/d3DirTree';

export default declare(
  (
    { assertVersion, types: t }: nodePathType,
    {
      dir = '.',
      callback,
      ...options
    }: {|
      ...d3DirTreeOptionsType,
      dir?: string,
      callback: (filenames: $ReadOnlyArray<string>) => string,
    |},
  ): {} => {
    const cacheFilePath = nodePath.resolve(dir, './.mergeDir');
    const cache = {};

    assertVersion(7);
    d3DirTree(dir, options)
      .leaves()
      .forEach(({ data: { path: filename } }: d3DirTreeNodeType) => {
        cache[filename] = nodePath.relative(dir, filename);
      });
    outputFileSync(cacheFilePath, callback?.(Object.values(cache)) || '');

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
        if (!filename.includes(dir)) return;

        cache[filename] = nodePath.relative(dir, filename);
        outputFileSync(cacheFilePath, callback?.(Object.values(cache)) || '');
      },
    };
  },
);
