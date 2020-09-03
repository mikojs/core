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
    const rootDir = nodePath.resolve(process.cwd(), dir);
    const cacheFilePath = nodePath.resolve(rootDir, './.mergeDir');
    const cache = {};

    assertVersion(7);
    d3DirTree(rootDir, options)
      .leaves()
      .forEach(({ data: { path: filename } }: d3DirTreeNodeType) => {
        cache[filename] = filename;
      });
    outputFileSync(cacheFilePath, callback?.(Object.values(cache)) || '');

    return {
      visitor: {
        ImportDeclaration: (
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
          const modulePath = nodePath.resolve(
            nodePath.dirname(filename),
            path.get('source').node.value,
          );

          if (modulePath !== rootDir) {
            if (modulePath.includes(rootDir)) path.remove();
            return;
          }

          path
            .get('source')
            .replaceWith(
              t.stringLiteral(
                nodePath.relative(nodePath.dirname(filename), cacheFilePath),
              ),
            );
        },

        CallExpression: (
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
          if (!t.isIdentifier(path.get('callee').node, { name: 'require' }))
            return;

          const modulePath = nodePath.resolve(
            nodePath.dirname(filename),
            path.get('arguments.0').node.value,
          );

          if (modulePath !== rootDir) {
            if (modulePath.includes(rootDir)) path.remove();
            return;
          }

          path
            .get('arguments.0')
            .replaceWith(
              t.stringLiteral(
                nodePath.relative(nodePath.dirname(filename), cacheFilePath),
              ),
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
        if (!filename.includes(rootDir)) return;

        cache[filename] = filename;
        outputFileSync(cacheFilePath, callback?.(Object.values(cache)) || '');
      },
    };
  },
);
